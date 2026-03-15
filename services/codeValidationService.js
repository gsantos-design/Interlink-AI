const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const OPENAI_CODE_REVIEW_MODEL = process.env.OPENAI_CODE_REVIEW_MODEL || 'gpt-5.2-codex';
const ANTHROPIC_CODE_REVIEW_MODEL = process.env.ANTHROPIC_CODE_REVIEW_MODEL || 'claude-3-5-sonnet-20241022';

const ALLOWED_PROVIDERS = new Set(['openai', 'anthropic']);
const ALLOWED_CHECKS = new Set(['quality', 'security']);
const ALLOWED_SEVERITIES = new Set(['info', 'low', 'medium', 'high', 'critical']);
const ALLOWED_CATEGORIES = new Set([
  'security',
  'quality',
  'correctness',
  'performance',
  'maintainability',
  'style',
]);

function normalizeProviders(providers) {
  if (!Array.isArray(providers) || providers.length === 0) {
    return ['openai', 'anthropic'];
  }

  const normalized = providers
    .map((provider) => String(provider || '').trim().toLowerCase())
    .filter((provider) => ALLOWED_PROVIDERS.has(provider));

  return normalized.length ? [...new Set(normalized)] : ['openai', 'anthropic'];
}

function normalizeChecks(checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return ['quality', 'security'];
  }

  const normalized = checks
    .map((check) => String(check || '').trim().toLowerCase())
    .filter((check) => ALLOWED_CHECKS.has(check));

  return normalized.length ? [...new Set(normalized)] : ['quality', 'security'];
}

function buildValidationPrompt({
  code,
  language,
  filename,
  repoUrl,
  context,
  checks,
}) {
  const scope = checks.join(' and ');
  const fileLabel = filename || 'snippet';
  const repoSection = repoUrl ? `Repository URL: ${repoUrl}\n` : '';
  const contextSection = context ? `Additional context:\n${context}\n\n` : '';

  return [
    `You are performing a ${scope} review of a ${language} ${fileLabel}.`,
    'Return JSON only. Do not include markdown fences or prose outside JSON.',
    'Focus on concrete issues that matter in production.',
    'If there are no issues, return an empty findings array and a concise summary.',
    '',
    `${repoSection}${contextSection}Respond with this exact JSON shape:`,
    JSON.stringify({
      summary: 'string',
      findings: [
        {
          title: 'string',
          severity: 'info|low|medium|high|critical',
          category: 'security|quality|correctness|performance|maintainability|style',
          file: fileLabel,
          line: 1,
          description: 'string',
          recommendation: 'string',
          confidence: 0.85,
        },
      ],
    }, null, 2),
    '',
    `Language: ${language}`,
    `Filename: ${fileLabel}`,
    `Checks requested: ${checks.join(', ')}`,
    '',
    'Code to review:',
    '```',
    code,
    '```',
  ].join('\n');
}

function extractFirstJsonObject(rawText) {
  if (!rawText) return null;

  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // Fall through to more permissive extraction.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch (error) {
      // Fall through to brace extraction.
    }
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch (error) {
      return null;
    }
  }

  return null;
}

function normalizeFinding(provider, finding, index, fallbackFile) {
  const severity = ALLOWED_SEVERITIES.has(String(finding?.severity || '').toLowerCase())
    ? String(finding.severity).toLowerCase()
    : 'medium';

  const category = ALLOWED_CATEGORIES.has(String(finding?.category || '').toLowerCase())
    ? String(finding.category).toLowerCase()
    : 'quality';

  const lineValue = Number.parseInt(finding?.line, 10);
  const confidenceValue = Number.parseFloat(finding?.confidence);

  return {
    id: `${provider}-${index + 1}`,
    provider,
    title: String(finding?.title || 'Untitled finding'),
    severity,
    category,
    file: String(finding?.file || fallbackFile || 'snippet'),
    line: Number.isFinite(lineValue) && lineValue > 0 ? lineValue : null,
    description: String(finding?.description || ''),
    recommendation: String(finding?.recommendation || ''),
    confidence: Number.isFinite(confidenceValue)
      ? Math.max(0, Math.min(1, confidenceValue))
      : null,
  };
}

function normalizeProviderResult(provider, model, rawPayload, fallbackFile) {
  const summary = String(rawPayload?.summary || '').trim();
  const findings = Array.isArray(rawPayload?.findings)
    ? rawPayload.findings.map((finding, index) => normalizeFinding(provider, finding, index, fallbackFile))
    : [];

  return {
    provider,
    model,
    summary,
    findings,
  };
}

async function validateWithOpenAI(input) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API Key is missing. Please check your environment configuration.');
  }

  const prompt = buildValidationPrompt(input);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/responses',
      {
        model: OPENAI_CODE_REVIEW_MODEL,
        input: prompt,
        reasoning: { effort: 'medium' },
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 90000,
      }
    );

    const parsed = extractFirstJsonObject(response.data?.output_text || '');
    if (!parsed) {
      throw new Error('OpenAI returned a non-JSON validation response.');
    }

    return normalizeProviderResult('openai', OPENAI_CODE_REVIEW_MODEL, parsed, input.filename);
  } catch (error) {
    console.error('OpenAI code validation error:', error.response?.data || error.message);
    throw new Error(`OpenAI validation error: ${error.response?.data?.error?.message || error.message}`);
  }
}

async function validateWithAnthropic(input) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API Key is missing. Please check your environment configuration.');
  }

  const prompt = buildValidationPrompt(input);

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: ANTHROPIC_CODE_REVIEW_MODEL,
        max_tokens: 2000,
        system: 'You are a strict code and security reviewer. Return JSON only.',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 90000,
      }
    );

    const rawText = response.data?.content?.map((item) => item?.text || '').join('\n') || '';
    const parsed = extractFirstJsonObject(rawText);
    if (!parsed) {
      throw new Error('Anthropic returned a non-JSON validation response.');
    }

    return normalizeProviderResult('anthropic', ANTHROPIC_CODE_REVIEW_MODEL, parsed, input.filename);
  } catch (error) {
    console.error('Anthropic code validation error:', error.response?.data || error.message);
    throw new Error(`Anthropic validation error: ${error.response?.data?.error?.message || error.message}`);
  }
}

async function validateCode(request) {
  const providers = normalizeProviders(request.providers);
  const checks = normalizeChecks(request.checks);

  const payload = {
    code: request.code,
    language: request.language || 'text',
    filename: request.filename || 'snippet',
    repoUrl: request.repoUrl || '',
    context: request.context || '',
    checks,
  };

  const providerRunners = {
    openai: () => validateWithOpenAI(payload),
    anthropic: () => validateWithAnthropic(payload),
  };

  const settled = await Promise.allSettled(
    providers.map(async (provider) => providerRunners[provider]())
  );

  const results = [];
  const errors = [];

  settled.forEach((result, index) => {
    const provider = providers[index];
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      errors.push({
        provider,
        error: result.reason?.message || String(result.reason || 'Unknown validation error'),
      });
    }
  });

  return {
    request: {
      language: payload.language,
      filename: payload.filename,
      checks,
      providers,
    },
    results,
    mergedFindings: results.flatMap((result) => result.findings),
    errors,
    meta: {
      successfulProviders: results.length,
      attemptedProviders: providers.length,
      totalFindings: results.reduce((count, result) => count + result.findings.length, 0),
    },
  };
}

module.exports = {
  validateCode,
  normalizeProviders,
  normalizeChecks,
};
