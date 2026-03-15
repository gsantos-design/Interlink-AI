// Interlink AI - Enhanced Application JavaScript
// Version 2.0

const defaultModels = [
  { 
    id: 'openai', 
    label: 'ChatGPT (OpenAI)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/><rect x="8" y="4" width="8" height="2" rx="1"/></svg>', 
    color: '#10a37f',
    personality: 'Confident & Knowledgeable',
    tagClass: 'tag-openai'
  },
  { 
    id: 'anthropic', 
    label: 'Claude (Anthropic)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-4.4-1-7.5-4.7-7.5-8.5V8.3l7.5-3.8 7.5 3.8v3.2c0 3.8-3.1 7.5-7.5 8.5z"/><circle cx="12" cy="12" r="3"/></svg>', 
    color: '#6B4FBB',
    personality: 'Thoughtful & Precise',
    tagClass: 'tag-claude'
  },
  { 
    id: 'gemini', 
    label: 'Gemini (Google)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>', 
    color: '#4285f4',
    personality: 'Creative & Unpredictable',
    tagClass: 'tag-gemini'
  },
  { 
    id: 'llama', 
    label: 'Llama 3.3 70B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="10" rx="8" ry="6"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5"/><rect x="10" y="2" width="4" height="4" rx="2"/></svg>', 
    color: '#0084ff',
    personality: 'Fast & Balanced',
    tagClass: 'tag-llama'
  },
  { 
    id: 'kimi', 
    label: 'Kimi-K2 (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/><path d="M10 10l2 2 4-4" stroke="#02030a" stroke-width="1.5" fill="none"/></svg>', 
    color: '#ff6b35',
    personality: 'Agentic Reasoning Expert',
    tagClass: 'tag-kimi'
  },
  { 
    id: 'gptoss120b', 
    label: 'GPT-OSS 120B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>', 
    color: '#8b5cf6',
    personality: 'High-Capability Reasoning',
    tagClass: 'tag-gptoss120b'
  },
  { 
    id: 'gptoss20b', 
    label: 'GPT-OSS 20B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="5" height="5" rx="1"/><rect x="13" y="6" width="5" height="5" rx="1"/><rect x="6" y="13" width="5" height="5" rx="1"/><rect x="13" y="13" width="5" height="5" rx="1"/></svg>', 
    color: '#06b6d4',
    personality: 'Compact & Efficient',
    tagClass: 'tag-gptoss20b'
  },
  { 
    id: 'compound', 
    label: 'Compound Beta (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="12" y1="9" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>', 
    color: '#ec4899',
    personality: 'Multi-Model Orchestrator',
    tagClass: 'tag-compound'
  },
];

let models = [...defaultModels];
let participants = [];
let lastPlaygroundResults = [];
let uploadedImageData = null;
let currentTutorialStep = 1;
let selectedTutor = null;
let chatHistory = [];
let lastCodeValidationPayload = null;

// Language options for voice
const languageOptions = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-ES', label: 'Spanish (ES)' },
  { code: 'es-MX', label: 'Spanish (LatAm)' },
  { code: 'pt-BR', label: 'Portuguese (BR)' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)' },
  { code: 'ar-SA', label: 'Arabic' },
];

let selectedVoiceLanguage = languageOptions[0].code;
const NATURAL_HINT = /(natural|neural|premium|studio|enhanced|hq|high quality|hd)/i;
const PROVIDER_HINT = /(microsoft|google|apple|amazon|openai)/i;

// Tutor configurations
const tutors = {
  einstein: {
    name: 'Robo Einstein',
    icon: 'avatars/robo-einstein.png',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    systemPrompt: 'You are Robo Einstein, a physics expert with deep systems thinking. Explain concepts using analogies from physics and mathematics. Be curious and encourage exploration of ideas.'
  },
  prof: {
    name: 'Robo Prof',
    icon: 'avatars/robo-prof.png',
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    systemPrompt: 'You are Robo Prof, a research strategist. Help users develop research methodologies, analyze papers, and think critically about academic work.'
  },
  mentor: {
    name: 'Robot Mentor',
    icon: 'avatars/robot-mentor.png',
    color: 'linear-gradient(135deg, #10b981, #059669)',
    systemPrompt: 'You are Robot Mentor, a delivery and project management expert. Help users plan projects, manage timelines, and navigate team dynamics.'
  },
  sage: {
    name: 'AI Sage',
    icon: 'avatars/ai-sage.png',
    color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    systemPrompt: 'You are AI Sage, a philosophy and critical thinking expert. Help users examine assumptions, explore ethical implications, and think deeply about complex topics.'
  },
  cyber: {
    name: 'Cyber Tutor',
    icon: 'avatars/cyber-tutor.png',
    color: 'linear-gradient(135deg, #ef4444, #dc2626)',
    systemPrompt: 'You are Cyber Tutor, a security and coding expert. Help users understand cybersecurity concepts, write secure code, and debug programming issues.'
  }
};

// Feedback storage
let feedbackData = [];

// ==========================================
// Utility Functions
// ==========================================

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--bg-panel);
    border: 1px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--accent)'};
    border-radius: 12px;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1001;
    animation: fadeIn 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

// ==========================================
// Model API Functions
// ==========================================

async function fetchModels() {
  // Force defaults first to ensure UI populates immediately
  models = [...defaultModels];
  renderModelSelectors();
  populateChatModelSelect();

  try {
    const res = await fetch('/api/models');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models) && data.models.length > 0) {
        // Only update if we actually got data back
        models = data.models.map(apiModel => {
          const defaultModel = defaultModels.find(m => m.id === apiModel.id);
          // Preserve the avatar and color from default if missing in API
          return { 
            ...defaultModel, 
            ...apiModel,
            avatar: defaultModel?.avatar || apiModel.avatar,
            color: defaultModel?.color || apiModel.color
          };
        });
        renderModelSelectors();
        populateChatModelSelect();
      }
    }
  } catch (err) {
    console.warn('API model fetch failed, keeping defaults', err);
  }
}

function renderModelSelectors() {
  const containers = [
    document.getElementById('model-toggles'),
    document.getElementById('raceModelToggles')
  ];
  
  containers.forEach(container => {
    if (!container) return;
    container.innerHTML = '';
    models.forEach((model, idx) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = model.id;
      input.checked = idx < 3;
      const span = document.createElement('span');
      span.textContent = model.label;
      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
  });
}

function populateChatModelSelect() {
  const select = document.getElementById('chatModel');
  if (!select) return;

  const previousValue = select.value;
  select.innerHTML = models
    .map((model) => `<option value="${model.id}">${model.label}</option>`)
    .join('');

  if (models.some((model) => model.id === previousValue)) {
    select.value = previousValue;
  } else if (models.some((model) => model.id === 'openai')) {
    select.value = 'openai';
  }
}

function getSelectedModelIds(containerId = 'model-toggles') {
  const container = document.getElementById(containerId);
  if (!container) return models.map((m) => m.id);
  const boxes = container.querySelectorAll('input[type="checkbox"]');
  const selected = [];
  boxes.forEach((box) => {
    if (box.checked) selected.push(box.value);
  });
  return selected.length ? selected : models.map((m) => m.id);
}

async function callModel(modelId, prompt, imageData = null) {
  const body = { model: modelId, prompt };
  if (imageData) {
    body.image = imageData;
  }
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data.reply || '';
}

function getCheckedValues(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
    .map((input) => input.value);
}

function getSeverityRank(severity) {
  const ranks = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
  return ranks[String(severity || '').toLowerCase()] || 0;
}

function sortValidationFindings(findings = []) {
  return [...findings].sort((a, b) => {
    const severityDiff = getSeverityRank(b.severity) - getSeverityRank(a.severity);
    if (severityDiff !== 0) return severityDiff;

    const fileDiff = String(a.file || '').localeCompare(String(b.file || ''));
    if (fileDiff !== 0) return fileDiff;

    return (a.line || 0) - (b.line || 0);
  });
}

function dedupeValidationFindings(findings = []) {
  const grouped = new Map();

  findings.forEach((finding) => {
    const key = [
      String(finding.file || 'snippet').toLowerCase(),
      finding.line || 0,
      String(finding.category || 'quality').toLowerCase(),
    ].join('|');

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...finding,
        providers: [finding.provider],
      });
      return;
    }

    const existing = grouped.get(key);
    const providers = new Set([...(existing.providers || [existing.provider]), finding.provider]);
    const severity = getSeverityRank(finding.severity) > getSeverityRank(existing.severity)
      ? finding.severity
      : existing.severity;
    const title = String(finding.title || '').length > String(existing.title || '').length
      ? finding.title
      : existing.title;
    const description = String(finding.description || '').length > String(existing.description || '').length
      ? finding.description
      : existing.description;
    const recommendation = String(finding.recommendation || '').length > String(existing.recommendation || '').length
      ? finding.recommendation
      : existing.recommendation;

    grouped.set(key, {
      ...existing,
      severity,
      title,
      description,
      recommendation,
      provider: [...providers].join(', '),
      confidence: existing.confidence ?? finding.confidence ?? null,
      providers: [...providers],
    });
  });

  return sortValidationFindings([...grouped.values()]);
}

const validationDemoSnippets = {
  auth: {
    language: 'javascript',
    filename: 'auth.js',
    context: 'Review this login handler for hardcoded secrets, token generation risks, and missing security controls.',
    code: `const password = 'secret';
async function login(req, res) {
  if (req.body.password === password) {
    res.json({ ok: true, token: 'hardcoded-token' });
  } else {
    res.status(401).json({ ok: false });
  }
}`,
  },
  sql: {
    language: 'javascript',
    filename: 'users.js',
    context: 'Review this API handler for injection, validation, and unsafe database access patterns.',
    code: `app.get('/users', async (req, res) => {
  const query = "SELECT * FROM users WHERE email = '" + req.query.email + "'";
  const rows = await db.query(query);
  res.json(rows);
});`,
  },
  secrets: {
    language: 'python',
    filename: 'storage.py',
    context: 'Review this cloud utility for credential handling, access control, and data exposure risks.',
    code: `AWS_ACCESS_KEY = "AKIA_TEST_KEY"
AWS_SECRET_KEY = "demo-secret-key"

def upload_report(client, payload):
    bucket = "company-prod-data"
    return client.put_object(Bucket=bucket, Key="reports/latest.json", Body=payload, ACL="public-read")`,
  },
};

function buildValidationReportText(payload) {
  const results = payload?.results || [];
  const findings = dedupeValidationFindings(payload?.mergedFindings || []);
  const errors = payload?.errors || [];

  const providerSection = results.length
    ? results.map((result) => `- ${result.provider} (${result.model}): ${result.summary || 'No summary returned.'}`).join('\n')
    : '- No successful providers';

  const findingSection = findings.length
    ? findings.map((finding) => {
      const location = `${finding.file || 'snippet'}${finding.line ? `:${finding.line}` : ''}`;
      return `- [${String(finding.severity || 'medium').toUpperCase()}] ${finding.title} | ${finding.provider} | ${finding.category} | ${location}\n  ${finding.description || ''}\n  Recommendation: ${finding.recommendation || 'None provided.'}`;
    }).join('\n')
    : '- No findings returned.';

  const errorSection = errors.length
    ? errors.map((entry) => `- ${entry.provider}: ${entry.error}`).join('\n')
    : '- None';

  return [
    'Interlink AI Code Validation Report',
    '',
    'Providers',
    providerSection,
    '',
    'Merged Findings',
    findingSection,
    '',
    'Provider Errors',
    errorSection,
  ].join('\n');
}

async function copyValidationReport() {
  if (!lastCodeValidationPayload) {
    showNotification('Run a validation pass before copying the report', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(buildValidationReportText(lastCodeValidationPayload));
    showNotification('Validation report copied', 'success');
  } catch (error) {
    console.error('Failed to copy validation report', error);
    showNotification('Unable to copy report from this browser', 'error');
  }
}

function renderCodeValidationResults(payload) {
  const container = document.getElementById('codeValidationResults');
  const meta = document.getElementById('validationMeta');
  if (!container) return;

  lastCodeValidationPayload = payload || null;

  const mergedFindings = dedupeValidationFindings(payload?.mergedFindings || []);
  const resultCount = mergedFindings.length;
  const providerCount = payload?.meta?.successfulProviders || 0;
  if (meta) {
    meta.textContent = providerCount
      ? `${providerCount} provider${providerCount === 1 ? '' : 's'} • ${resultCount} finding${resultCount === 1 ? '' : 's'}`
      : 'No successful providers';
  }

  if (!payload || (!payload.results?.length && !payload.errors?.length)) {
    container.innerHTML = `
      <div class="results-placeholder">
        <p>No validation data yet.</p>
      </div>
    `;
    return;
  }

  const providerHtml = (payload.results || []).map((result) => `
    <article class="validation-provider-card">
      <div class="validation-provider-head">
        <h4>${escapeHtml(result.provider)}</h4>
        <span class="validation-provider-model">${escapeHtml(result.model)}</span>
      </div>
      <div class="validation-provider-summary">${escapeHtml(result.summary || 'No summary returned.')}</div>
    </article>
  `).join('');

  const findingsHtml = mergedFindings.map((finding) => `
    <article class="validation-finding-card">
      <div class="validation-finding-head">
        <h4>${escapeHtml(finding.title)}</h4>
        <span class="severity-pill severity-${escapeHtml(finding.severity)}">${escapeHtml(finding.severity)}</span>
      </div>
      <div class="validation-finding-meta">
        ${escapeHtml(finding.provider)} • ${escapeHtml(finding.category)} • ${escapeHtml(finding.file || 'snippet')}${finding.line ? `:${finding.line}` : ''}
      </div>
      <p>${escapeHtml(finding.description || '')}</p>
      ${finding.recommendation ? `<p><strong>Recommendation:</strong> ${escapeHtml(finding.recommendation)}</p>` : ''}
    </article>
  `).join('');

  const errorsHtml = (payload.errors || []).map((entry) => `
    <article class="validation-error-card">
      <div class="validation-finding-head">
        <h4>${escapeHtml(entry.provider)}</h4>
        <span class="severity-pill severity-medium">error</span>
      </div>
      <p>${escapeHtml(entry.error)}</p>
    </article>
  `).join('');

  container.innerHTML = `
    ${providerHtml ? `<div class="validation-provider-list">${providerHtml}</div>` : ''}
    ${findingsHtml ? `<h4 class="validation-section-title">Merged Findings</h4><div class="validation-findings-list">${findingsHtml}</div>` : '<p class="validation-provider-summary">No findings returned.</p>'}
    ${errorsHtml ? `<h4 class="validation-section-title">Provider Errors</h4><div class="validation-errors-list">${errorsHtml}</div>` : ''}
  `;
}

function renderModelUpdates(modelsData, updatedAt) {
  const container = document.getElementById('modelUpdatesList');
  const meta = document.getElementById('modelUpdatesMeta');
  if (!container) return;

  if (meta) {
    meta.textContent = updatedAt ? `Updated ${new Date(updatedAt).toLocaleString()}` : 'Metadata loaded';
  }

  if (!Array.isArray(modelsData) || !modelsData.length) {
    container.innerHTML = `
      <div class="results-placeholder">
        <p>No model version data available.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = modelsData.map((model) => `
    <article class="model-update-card">
      <div class="model-update-head">
        <h4>${escapeHtml(model.label)}</h4>
        <span class="status-pill status-${escapeHtml(model.status)}">${escapeHtml(model.status.replace('_', ' '))}</span>
      </div>
      <div class="model-update-provider">${escapeHtml(model.provider)} • ${escapeHtml(model.version)}</div>
      ${model.reviewModel ? `<div class="model-update-review">Code validation model: ${escapeHtml(model.reviewModel)}</div>` : ''}
      <p>${model.lastVerifiedAt ? `Last verified ${escapeHtml(new Date(model.lastVerifiedAt).toLocaleString())}` : 'Not yet verified automatically'}</p>
    </article>
  `).join('');
}

async function loadModelUpdates() {
  try {
    const response = await fetch('/api/model-updates');
    if (!response.ok) {
      throw new Error(`Model updates request failed with ${response.status}`);
    }

    const data = await response.json();
    renderModelUpdates(data.models, data.updatedAt);
  } catch (error) {
    console.warn('Model updates failed', error);
    renderModelUpdates([], null);
  }
}

async function handleCodeValidationRun() {
  const codeEl = document.getElementById('validationCode');
  const languageEl = document.getElementById('validationLanguage');
  const filenameEl = document.getElementById('validationFilename');
  const repoUrlEl = document.getElementById('validationRepoUrl');
  const contextEl = document.getElementById('validationContext');

  const code = codeEl?.value?.trim();
  if (!code) {
    showNotification('Please enter code to validate', 'error');
    return;
  }

  const providers = getCheckedValues('codeValidationProviders');
  const checks = getCheckedValues('codeValidationChecks');
  if (!providers.length || !checks.length) {
    showNotification('Select at least one provider and one check', 'error');
    return;
  }

  const container = document.getElementById('codeValidationResults');
  const meta = document.getElementById('validationMeta');
  if (meta) meta.textContent = 'Running...';
  if (container) {
    container.innerHTML = `
      <div class="results-placeholder">
        <p>Running validation across ${providers.join(', ')}...</p>
      </div>
    `;
  }

  try {
    const response = await fetch('/api/validate/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language: languageEl?.value?.trim() || 'text',
        filename: filenameEl?.value?.trim() || 'snippet',
        repoUrl: repoUrlEl?.value?.trim() || '',
        context: contextEl?.value?.trim() || '',
        checks,
        providers,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (data && (Array.isArray(data.errors) || Array.isArray(data.results))) {
        renderCodeValidationResults(data);
        showNotification(data.error || `Validation failed with ${response.status}`, 'error');
        return;
      }

      throw new Error(data.error || `Validation failed with ${response.status}`);
    }

    renderCodeValidationResults(data);
    showNotification('Code validation complete', 'success');
  } catch (error) {
    console.error('Code validation failed', error);
    renderCodeValidationResults({ results: [], mergedFindings: [], errors: [{ provider: 'system', error: error.message || 'Validation failed' }], meta: { successfulProviders: 0, totalFindings: 0 } });
    showNotification(error.message || 'Code validation failed', 'error');
  }
}

function applyValidationDemoSnippet(key) {
  const snippet = validationDemoSnippets[key];
  if (!snippet) return;

  const languageEl = document.getElementById('validationLanguage');
  const filenameEl = document.getElementById('validationFilename');
  const contextEl = document.getElementById('validationContext');
  const codeEl = document.getElementById('validationCode');

  if (languageEl) languageEl.value = snippet.language;
  if (filenameEl) filenameEl.value = snippet.filename;
  if (contextEl) contextEl.value = snippet.context;
  if (codeEl) codeEl.value = snippet.code;
}

function wireCodeValidation() {
  const button = document.getElementById('runCodeValidation');
  if (button) {
    button.addEventListener('click', handleCodeValidationRun);
  }

  const copyButton = document.getElementById('copyValidationReport');
  if (copyButton) {
    copyButton.addEventListener('click', copyValidationReport);
  }

  document.querySelectorAll('[data-validation-snippet]').forEach((buttonEl) => {
    buttonEl.addEventListener('click', () => applyValidationDemoSnippet(buttonEl.dataset.validationSnippet));
  });
}

// ==========================================
// Hero Section
// ==========================================

function setHeroState(modelId, statusText, content) {
  const card = document.querySelector(`.output-card[data-model="${modelId}"]`);
  if (!card) return;
  const statusEl = card.querySelector('.status');
  const outEl = card.querySelector('.output-text');
  if (statusEl) statusEl.textContent = statusText || '';
  if (outEl && typeof content === 'string') outEl.textContent = content;
}

async function handleHeroRun() {
  console.log('Fan out button clicked');
  const promptEl = document.getElementById('heroPrompt');
  if (!promptEl) {
    console.error('Prompt element not found');
    return;
  }
  const prompt = promptEl.value.trim();
  if (!prompt) {
    alert('Please enter a prompt first.');
    return;
  }
  
  const targets = ['openai', 'anthropic', 'gemini'];
  targets.forEach((id) => setHeroState(id, 'running...', '')); 
  
  await Promise.all(
    targets.map(async (id) => {
      try {
        const reply = await callModel(id, prompt);
        setHeroState(id, 'done', reply);
      } catch (err) {
        setHeroState(id, 'error', err.message || err.toString());
      }
    })
  );
}

function wireHero() {
  const btn = document.getElementById('heroRun');
  if (btn) btn.addEventListener('click', handleHeroRun);
}

// ==========================================
// Playground Section
// ==========================================

function renderPlaygroundResults(items) {
  const container = document.getElementById('playgroundResults');
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = `
      <div class="placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>Outputs will appear here after you run.</p>
      </div>`;
    return;
  }
  
  const html = items.map((item, idx) => {
    const modelData = models.find(m => m.label === item.label || m.id === item.label) || {};
    return `
      <div class="result-item" data-result-idx="${idx}">
        <div class="result-head">
          <div class="model-info">
            <span class="model-avatar" style="background: ${modelData.color || '#333'}" title="${modelData.personality || ''}">${modelData.avatar || '🤖'}</span>
            <span>${item.label}</span>
          </div>
          <div class="head-actions">
            ${item.status === 'done' ? `<button class="speak-btn" data-idx="${idx}" title="Read aloud">🔊</button>` : ''}
            <span>${item.status}</span>
          </div>
        </div>
        <div class="result-body">${escapeHtml(item.text)}</div>
        ${item.status === 'done' ? `
          <div class="feedback-bar">
            <button class="feedback-btn thumbs-up" data-idx="${idx}" title="Good response">👍</button>
            <button class="feedback-btn thumbs-down" data-idx="${idx}" title="Bad response">👎</button>
            <select class="issue-select" data-idx="${idx}" title="Flag issue">
              <option value="">Flag issue...</option>
              <option value="wrong">Wrong/Incorrect</option>
              <option value="overconfident">Overconfident</option>
              <option value="hallucinated">Hallucinated</option>
              <option value="refused">Refused to answer</option>
              <option value="biased">Biased</option>
            </select>
            <button class="advanced-feedback-btn" data-idx="${idx}" title="Advanced feedback">📊</button>
          </div>
        ` : ''}
      </div>`;
  }).join('');
  
  container.innerHTML = html;
  wireFeedbackButtons();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function handlePlaygroundRun() {
  const promptEl = document.getElementById('playgroundPrompt');
  if (!promptEl) return;
  const prompt = promptEl.value.trim();
  if (!prompt) {
    showNotification('Please enter a prompt', 'error');
    return;
  }
  
  const selected = getSelectedModelIds();
  if (!selected.length) {
    showNotification('Please select at least one model', 'error');
    return;
  }
  
  const imageNote = uploadedImageData ? ' (with image)' : '';
  lastPlaygroundResults = [];
  renderPlaygroundResults(selected.map((id) => {
    const meta = models.find((m) => m.id === id) || { label: id };
    return { label: meta.label, status: 'running...' + imageNote, text: '' };
  }));
  
  const results = [];
  for (const id of selected) {
    const meta = models.find((m) => m.id === id) || { label: id };
    const startedAt = performance.now();
    try {
      const reply = await callModel(id, prompt, uploadedImageData);
      const latency = Math.round(performance.now() - startedAt);
      results.push({ id, label: meta.label, status: 'done', text: reply, latency, success: true });
    } catch (err) {
      const latency = Math.round(performance.now() - startedAt);
      results.push({ id, label: meta.label, status: 'error', text: err.message || err.toString(), latency, success: false });
    }
    // Update UI progressively
    renderPlaygroundResults([...results, ...selected.slice(results.length).map(rid => {
      const m = models.find((m) => m.id === rid) || { label: rid };
      return { label: m.label, status: 'waiting...', text: '' };
    })]);
  }
  
  lastPlaygroundResults = results;
  renderPlaygroundResults(results);
  showNotification('Experiment complete!', 'success');
}

function wirePlayground() {
  const btn = document.getElementById('playgroundRun');
  if (btn) btn.addEventListener('click', handlePlaygroundRun);
  
  const exampleSelect = document.getElementById('exampleSelect');
  if (exampleSelect) {
    exampleSelect.addEventListener('change', () => {
      const promptEl = document.getElementById('playgroundPrompt');
      if (!promptEl) return;
      const examples = {
        'spanish-learning': 'Summarize the key steps to set up a multimodal RAG pipeline using LangChain and a vector database. Include code snippets.',
        'troubleshooting': 'I\'m getting "Cannot read property \'map\' of undefined" in my React component. The data comes from an API call. How do I debug and fix this?',
        'design-review': 'Review this landing page design for a SaaS product. What are the UX issues and how can we improve conversion?',
        'code-refactor': 'Refactor this function for better performance and readability:\n\nfunction processData(arr) {\n  let result = [];\n  for(let i = 0; i < arr.length; i++) {\n    if(arr[i].active === true) {\n      result.push(arr[i].name.toUpperCase());\n    }\n  }\n  return result;\n}',
        'product-compare': 'Compare PostgreSQL vs MongoDB for a real-time analytics dashboard that needs to handle 10M events/day with complex aggregations.'
      };
      if (examples[exampleSelect.value]) {
        promptEl.value = examples[exampleSelect.value];
      }
    });
  }
  
  // Image upload handling
  const visionUpload = document.getElementById('visionUpload');
  if (visionUpload) {
    visionUpload.addEventListener('change', handleImageUpload);
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageData = e.target.result;
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.innerHTML = `
        <div class="image-preview-content">
          <img src="${uploadedImageData}" alt="Uploaded image" />
          <button class="remove-image-btn" onclick="removeUploadedImage()">Remove</button>
        </div>
      `;
    }
    showNotification('Image uploaded successfully', 'success');
  };
  reader.readAsDataURL(file);
}

function removeUploadedImage() {
  uploadedImageData = null;
  const preview = document.getElementById('imagePreview');
  if (preview) preview.innerHTML = '';
  const input = document.getElementById('visionUpload');
  if (input) input.value = '';
}

// ==========================================
// Race Section
// ==========================================

function renderParticipants() {
  const list = document.getElementById('participantList');
  if (!list) return;
  if (!participants.length) {
    list.innerHTML = '<span style="color: var(--muted);">No participants yet.</span>';
    return;
  }
  list.innerHTML = participants.map(name => `
    <span class="participant-chip" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg-contrast); border: 1px solid var(--border); border-radius: 999px; font-size: 0.88rem;">
      ${escapeHtml(name)}
      <button onclick="removeParticipant('${escapeHtml(name)}')" style="background: none; border: none; color: var(--muted); cursor: pointer; padding: 0;">×</button>
    </span>
  `).join(' ');
}

function addParticipant() {
  const input = document.getElementById('participantName');
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  if (participants.includes(name)) {
    showNotification('Participant already added', 'error');
    return;
  }
  participants.push(name);
  input.value = '';
  renderParticipants();
}

function removeParticipant(name) {
  participants = participants.filter(p => p !== name);
  renderParticipants();
}

function renderRaceEntries(payload) {
  const entries = document.getElementById('raceEntries');
  const status = document.getElementById('raceStatus');
  const winner = document.getElementById('raceWinner');
  
  if (!entries) return;
  
  if (!payload || !Array.isArray(payload.results) || !payload.results.length) {
    entries.innerHTML = `
      <div class="placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p>Run a race to see model answers and timings.</p>
      </div>`;
    if (status) status.textContent = 'No race running.';
    if (winner) winner.textContent = '';
    return;
  }
  
  const { results, totalLatencyMs } = payload;
  
  if (status) {
    status.innerHTML = `<span style="color: var(--success);">Race complete!</span> Total time: ${totalLatencyMs}ms`;
  }
  
  entries.innerHTML = results.map((r, i) => {
    const modelData = models.find(m => m.id === r.modelId) || {};
    return `
      <div class="result-item">
        <div class="result-head">
          <div class="model-info">
            <span style="font-weight: 700; color: ${i === 0 ? 'var(--success)' : 'var(--muted)'};">#${i + 1}</span>
            <span class="model-avatar" style="background: ${modelData.color || '#333'}">${modelData.avatar || '🤖'}</span>
            <span>${r.modelId}</span>
          </div>
          <span style="color: var(--accent);">${r.latencyMs}ms</span>
        </div>
        <div class="result-body">${escapeHtml(r.text || (typeof r.error === 'object' ? JSON.stringify(r.error) : r.error) || '')}</div>
      </div>
    `;
  }).join('');
  
  if (winner && results.length > 0) {
    winner.innerHTML = `<div style="margin-top: 16px; padding: 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); border-radius: 12px; text-align: center;">
      <span style="font-size: 1.5rem;">🏆</span>
      <strong>${results[0].modelId}</strong> wins with ${results[0].latencyMs}ms!
    </div>`;
  }
}

async function handleStartRace() {
  const titleEl = document.getElementById('raceTitle');
  const rulesEl = document.getElementById('raceRules');
  
  const title = titleEl?.value.trim() || 'Untitled Race';
  const rules = rulesEl?.value.trim() || '';
  
  const selected = getSelectedModelIds('raceModelToggles');
  if (selected.length < 2) {
    showNotification('Select at least 2 models for a race', 'error');
    return;
  }
  
  const prompt = `${title}\n\n${rules}`.trim();
  
  document.getElementById('raceStatus').textContent = 'Race in progress...';
  document.getElementById('raceEntries').innerHTML = `
    <div class="placeholder">
      <div style="width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p>Models are racing...</p>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
  
  const startTime = Date.now();
  const results = [];
  
  await Promise.all(selected.map(async (modelId) => {
    const modelStart = Date.now();
    try {
      const reply = await callModel(modelId, prompt);
      results.push({
        modelId,
        text: reply,
        latencyMs: Date.now() - modelStart
      });
    } catch (err) {
      results.push({
        modelId,
        error: err.message,
        latencyMs: Date.now() - modelStart
      });
    }
  }));
  
  // Sort by latency
  results.sort((a, b) => a.latencyMs - b.latencyMs);
  
  renderRaceEntries({
    results,
    totalLatencyMs: Date.now() - startTime
  });
}

function wireRace() {
  const startBtn = document.getElementById('startRace');
  if (startBtn) startBtn.addEventListener('click', handleStartRace);
}

function wireParticipants() {
  const addBtn = document.getElementById('addParticipant');
  if (addBtn) addBtn.addEventListener('click', addParticipant);
  
  const input = document.getElementById('participantName');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addParticipant();
    });
  }
}

// ==========================================
// Feedback System
// ==========================================

function wireFeedbackButtons() {
  // Thumbs up/down
  document.querySelectorAll('.thumbs-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      recordFeedback(idx, 'thumbs_up');
      btn.style.background = 'var(--success)';
      showNotification('Thanks for the feedback!', 'success');
    });
  });
  
  document.querySelectorAll('.thumbs-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      recordFeedback(idx, 'thumbs_down');
      btn.style.background = 'var(--error)';
      showNotification('Thanks for the feedback!', 'success');
    });
  });
  
  // Issue select
  document.querySelectorAll('.issue-select').forEach(select => {
    select.addEventListener('change', () => {
      const idx = select.dataset.idx;
      if (select.value) {
        recordFeedback(idx, 'issue', select.value);
        showNotification(`Issue flagged: ${select.value}`, 'info');
      }
    });
  });
  
  // Speak buttons
  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      if (lastPlaygroundResults[idx]) {
        speakText(lastPlaygroundResults[idx].text);
      }
    });
  });
  
  // Advanced feedback
  document.querySelectorAll('.advanced-feedback-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      showAdvancedFeedback(idx);
    });
  });
}

function recordFeedback(idx, type, value = null) {
  const result = lastPlaygroundResults[parseInt(idx)];
  if (!result) return;
  
  const feedback = {
    timestamp: new Date().toISOString(),
    model: result.label,
    prompt: document.getElementById('playgroundPrompt')?.value || '',
    response: result.text,
    feedbackType: type,
    feedbackValue: value
  };
  
  feedbackData.push(feedback);
  localStorage.setItem('interlinkFeedback', JSON.stringify(feedbackData));
}

function showAdvancedFeedback(idx) {
  const result = lastPlaygroundResults[parseInt(idx)];
  if (!result) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.closest('.modal').remove()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <h2>Advanced Feedback</h2>
      <p>Rate this response from ${result.label}</p>
      
      <div class="field-group">
        <label>Accuracy (1-5)</label>
        <input type="range" min="1" max="5" value="3" id="advAccuracy" class="input" />
      </div>
      
      <div class="field-group">
        <label>Helpfulness (1-5)</label>
        <input type="range" min="1" max="5" value="3" id="advHelpfulness" class="input" />
      </div>
      
      <div class="field-group">
        <label>Clarity (1-5)</label>
        <input type="range" min="1" max="5" value="3" id="advClarity" class="input" />
      </div>
      
      <div class="field-group">
        <label>Notes</label>
        <textarea id="advNotes" class="input" rows="3" placeholder="Any additional comments..."></textarea>
      </div>
      
      <button class="btn btn-primary full" onclick="submitAdvancedFeedback(${idx}, this.closest('.modal'))">Submit Feedback</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function submitAdvancedFeedback(idx, modal) {
  const result = lastPlaygroundResults[parseInt(idx)];
  if (!result) return;
  
  const feedback = {
    timestamp: new Date().toISOString(),
    model: result.label,
    prompt: document.getElementById('playgroundPrompt')?.value || '',
    response: result.text,
    feedbackType: 'advanced',
    accuracy: document.getElementById('advAccuracy')?.value,
    helpfulness: document.getElementById('advHelpfulness')?.value,
    clarity: document.getElementById('advClarity')?.value,
    notes: document.getElementById('advNotes')?.value
  };
  
  feedbackData.push(feedback);
  localStorage.setItem('interlinkFeedback', JSON.stringify(feedbackData));
  
  modal.remove();
  showNotification('Advanced feedback recorded!', 'success');
}

function downloadFeedbackCSV() {
  if (!feedbackData.length) {
    showNotification('No feedback data to export', 'error');
    return;
  }
  
  const headers = ['timestamp', 'model', 'prompt', 'response', 'feedbackType', 'feedbackValue', 'accuracy', 'helpfulness', 'clarity', 'notes'];
  const rows = feedbackData.map(f => headers.map(h => `"${(f[h] || '').toString().replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interlink-feedback-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Feedback CSV downloaded!', 'success');
}

// ==========================================
// Voice Functions
// ==========================================

async function initVoiceUI() {
  // Populate language selects
  const langSelects = [document.getElementById('voiceLanguage'), document.getElementById('chatVoiceLang')];
  langSelects.forEach(select => {
    if (!select) return;
    select.innerHTML = languageOptions.map(opt => 
      `<option value="${opt.code}">${opt.label}</option>`
    ).join('');
    select.addEventListener('change', () => {
      selectedVoiceLanguage = select.value;
      populateVoiceOutputSelect(select.value);
    });
  });
  
  populateVoiceOutputSelect(selectedVoiceLanguage);
  populateChatVoices();
}

function populateVoiceOutputSelect(langCode) {
  const select = document.getElementById('voiceOutputVoice');
  if (!select) return;
  
  const voices = window.speechSynthesis?.getVoices() || [];
  const filtered = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
  
  select.innerHTML = '<option value="">Best voice for selected language</option>' +
    filtered.map(v => `<option value="${v.name}">${v.name}</option>`).join('');
}

function populateChatVoices() {
  const select = document.getElementById('chatVoice');
  if (!select) return;
  
  const voices = window.speechSynthesis?.getVoices() || [];
  select.innerHTML = '<option value="">Default voice</option>' +
    voices.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
}

function speakText(text, options = {}) {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in this browser.');
    return;
  }
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const {
    voiceSelectId = 'voiceOutputVoice',
    language = selectedVoiceLanguage,
  } = options;
  
  // Use the requested voice when available, otherwise fall back to a matching language voice.
  let voice = null;
  const voiceSelect = document.getElementById(voiceSelectId);
  if (voiceSelect?.value) {
    voice = voices.find(v => v.name === voiceSelect.value);
  }
  
  if (!voice) {
    const languagePrefix = (language || selectedVoiceLanguage || 'en-US').split('-')[0];
    voice = voices.find(v => v.lang.toLowerCase().startsWith(languagePrefix.toLowerCase()))
      || voices.find(v => v.lang.toLowerCase().includes('en'))
      || voices[0];
  }
  
  if (voice) utterance.voice = voice;
  utterance.lang = language || selectedVoiceLanguage;
  
  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
  };
  
  window.speechSynthesis.speak(utterance);
}

let isRecording = false;
let recognition = null;

function wireVoiceControls() {
  const voiceBtn = document.getElementById('voiceInputBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', toggleVoiceInput);
  }
}

function toggleVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    return;
  }
  
  const btn = document.getElementById('voiceInputBtn');
  
  if (isRecording) {
    if (recognition) recognition.stop();
    isRecording = false;
    btn.classList.remove('active');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
      </svg>
      Voice Input
    `;
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = selectedVoiceLanguage;
  
  recognition.onstart = () => {
    isRecording = true;
    btn.classList.add('active');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="12" height="16" rx="2"/>
      </svg>
      Stop Recording
    `;
  };
  
  recognition.onresult = (event) => {
    const promptEl = document.getElementById('playgroundPrompt');
    if (!promptEl) return;
    
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    promptEl.value = transcript;
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      alert('Microphone access denied. Please allow microphone access in your browser settings.');
    } else {
      showNotification(`Voice input error: ${event.error}`, 'error');
    }
    isRecording = false;
    btn.classList.remove('active');
  };
  
  recognition.onend = () => {
    isRecording = false;
    btn.classList.remove('active');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
      </svg>
      Voice Input
    `;
  };
  
  recognition.start();
}

// ==========================================
// Expert Mode / One-on-One Chat
// ==========================================

function selectTutor(tutorId) {
  selectedTutor = tutorId;
  const tutor = tutors[tutorId];
  if (!tutor) return;
  
  // Update avatar selection UI
  document.querySelectorAll('.tutor-avatar').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelector(`.tutor-avatar[data-avatar="${tutorId}"]`)?.classList.add('active');
  
  // Show chat interface
  const chatInterface = document.getElementById('chatInterface');
  if (chatInterface) {
    chatInterface.style.display = 'block';
  }
  
  // Update tutor display
  const avatarLarge = document.getElementById('activeTutorIcon');
  const avatarImage = document.getElementById('activeTutorImg');
  const tutorName = document.getElementById('activeTutorName');
  const tutorGreeting = document.getElementById('tutorGreeting');
  
  if (avatarLarge) {
    avatarLarge.style.background = tutor.color;
  }
  if (avatarImage) {
    avatarImage.src = tutor.icon;
    avatarImage.alt = tutor.name;
  }
  if (tutorName) tutorName.textContent = tutor.name;
  if (tutorGreeting) tutorGreeting.textContent = tutor.name;
  
  // Reset chat
  chatHistory = [];
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="chat-message assistant">
        <div class="message-content">
          <p>Hello! I'm ${tutor.name}. What would you like to learn about today?</p>
        </div>
      </div>
    `;
  }
}

function endChat() {
  const chatInterface = document.getElementById('chatInterface');
  if (chatInterface) {
    chatInterface.style.display = 'none';
  }
  selectedTutor = null;
  chatHistory = [];
  
  document.querySelectorAll('.tutor-avatar').forEach(el => {
    el.classList.remove('active');
  });
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  const modelSelect = document.getElementById('chatModel');
  
  if (!input || !messagesContainer || !selectedTutor) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  const tutor = tutors[selectedTutor];
  const modelId = modelSelect?.value || 'openai';
  
  // Add user message
  messagesContainer.innerHTML += `
    <div class="chat-message user">
      <div class="message-content">
        <p>${escapeHtml(message)}</p>
      </div>
    </div>
  `;
  
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add typing indicator
  messagesContainer.innerHTML += `
    <div class="chat-message assistant typing-indicator">
      <div class="message-content">
        <p>Thinking...</p>
      </div>
    </div>
  `;
  
  // Build prompt with system context
  const fullPrompt = `${tutor.systemPrompt}\n\nUser: ${message}`;
  
  try {
    const reply = await callModel(modelId, fullPrompt);
    
    // Remove typing indicator
    messagesContainer.querySelector('.typing-indicator')?.remove();
    
    // Add assistant response
    messagesContainer.innerHTML += `
      <div class="chat-message assistant">
        <div class="message-content">
          <p>${escapeHtml(reply)}</p>
        </div>
      </div>
    `;
    
    const chatLanguage = document.getElementById('chatVoiceLang')?.value || selectedVoiceLanguage;
    speakText(reply, {
      voiceSelectId: 'chatVoice',
      language: chatLanguage,
    });
    
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: reply });
    
  } catch (err) {
    messagesContainer.querySelector('.typing-indicator')?.remove();
    messagesContainer.innerHTML += `
      <div class="chat-message assistant">
        <div class="message-content" style="color: var(--error);">
          <p>Sorry, I encountered an error: ${escapeHtml(err.message)}</p>
        </div>
      </div>
    `;
  }
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

let chatRecording = false;
let chatRecognition = null;

function toggleChatVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showNotification('Speech recognition not supported', 'error');
    return;
  }
  
  const btn = document.getElementById('chatMic');
  
  if (chatRecording) {
    if (chatRecognition) chatRecognition.stop();
    chatRecording = false;
    btn.classList.remove('active');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  chatRecognition = new SpeechRecognition();
  chatRecognition.continuous = false;
  chatRecognition.interimResults = false;
  chatRecognition.lang = document.getElementById('chatVoiceLang')?.value || 'en-US';
  
  chatRecognition.onstart = () => {
    chatRecording = true;
    btn.classList.add('active');
  };
  
  chatRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('chatInput');
    if (input) {
      input.value = transcript;
      sendChatMessage();
    }
  };
  
  chatRecognition.onend = () => {
    chatRecording = false;
    btn.classList.remove('active');
  };
  
  chatRecognition.onerror = (event) => {
    console.error('Chat voice error:', event.error);
    chatRecording = false;
    btn.classList.remove('active');
  };
  
  chatRecognition.start();
}

// ==========================================
// Tutorial Modal
// ==========================================

function showTutorial() {
  const modal = document.getElementById('tutorialModal');
  if (modal) {
    modal.classList.add('active');
    currentTutorialStep = 1;
    updateTutorialStep();
  }
}

function closeTutorial() {
  const modal = document.getElementById('tutorialModal');
  if (modal) {
    modal.classList.remove('active');
  }
  localStorage.setItem('interlinkTutorialSeen', 'true');
}

function updateTutorialStep() {
  document.querySelectorAll('.tutorial-page').forEach(page => {
    page.classList.remove('active');
  });
  
  const currentPage = document.querySelector(`.tutorial-page[data-step="${currentTutorialStep}"]`);
  if (currentPage) currentPage.classList.add('active');
  
  const progress = document.getElementById('tutorialProgress');
  if (progress) progress.textContent = `${currentTutorialStep} / 5`;
  
  const prevBtn = document.getElementById('tutorialPrev');
  const nextBtn = document.getElementById('tutorialNext');
  
  if (prevBtn) prevBtn.style.visibility = currentTutorialStep === 1 ? 'hidden' : 'visible';
  if (nextBtn) {
    nextBtn.textContent = currentTutorialStep === 5 ? 'Start Learning' : 'Next';
    nextBtn.innerHTML = currentTutorialStep === 5 ? 'Start Learning' : `Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
  }
}

function nextTutorialStep() {
  if (currentTutorialStep >= 5) {
    closeTutorial();
    return;
  }
  currentTutorialStep++;
  updateTutorialStep();
}

function prevTutorialStep() {
  if (currentTutorialStep <= 1) return;
  currentTutorialStep--;
  updateTutorialStep();
}

// ==========================================
// Registration Modal
// ==========================================

function showRegistration() {
  const modal = document.getElementById('registrationModal');
  if (modal) modal.classList.add('active');
}

function closeRegistration() {
  const modal = document.getElementById('registrationModal');
  if (modal) modal.classList.remove('active');
}

function handleRegistration(event) {
  event.preventDefault();
  
  const name = document.getElementById('regName')?.value;
  const email = document.getElementById('regEmail')?.value;
  const password = document.getElementById('regPassword')?.value;
  
  // Store locally (in production, send to backend)
  localStorage.setItem('interlinkUser', JSON.stringify({ name, email }));
  
  const status = document.getElementById('registrationStatus');
  if (status) {
    status.innerHTML = '<span style="color: var(--success);">Account created! Welcome to Interlink AI.</span>';
  }
  
  setTimeout(() => {
    closeRegistration();
    showNotification(`Welcome, ${name}!`, 'success');
  }, 1500);
}

// ==========================================
// Age Verification
// ==========================================

function showAgeVerification() {
  const modal = document.getElementById('ageVerificationModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function verifyAge() {
  const birthdateInput = document.getElementById('birthdate');
  if (!birthdateInput?.value) {
    showNotification('Please enter your date of birth', 'error');
    return;
  }
  
  const birthdate = new Date(birthdateInput.value);
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  const dayDiff = today.getDate() - birthdate.getDate();
  const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
  
  localStorage.setItem('interlinkAgeVerified', 'true');
  localStorage.setItem('interlinkUserAge', actualAge);
  
  if (actualAge < 13) {
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('ageDeniedStep').style.display = 'block';
  } else if (actualAge < 18) {
    localStorage.setItem('interlinkSafeMode', 'true');
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('parentalConsentStep').style.display = 'block';
  } else {
    localStorage.setItem('interlinkSafeMode', 'false');
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('ageVerifiedStep').style.display = 'block';
  }
}

function submitParentalConsent() {
  const parentEmail = document.getElementById('parentEmail')?.value;
  const consentChecked = document.getElementById('parentConsent')?.checked;
  
  if (!parentEmail || !consentChecked) {
    showNotification('Please provide parent email and confirm consent', 'error');
    return;
  }
  
  localStorage.setItem('interlinkParentEmail', parentEmail);
  localStorage.setItem('interlinkParentalConsent', 'true');
  
  document.getElementById('parentalConsentStep').style.display = 'none';
  document.getElementById('ageVerifiedStep').style.display = 'block';
}

function closeAgeVerification() {
  const modal = document.getElementById('ageVerificationModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
  
  if (!localStorage.getItem('interlinkTutorialSeen')) {
    setTimeout(showTutorial, 500);
  }
}

// ==========================================
// Community Functions
// ==========================================

function submitIdea() {
  const input = document.getElementById('ideaInput');
  if (!input?.value.trim()) {
    showNotification('Please describe your idea', 'error');
    return;
  }
  
  // Store locally (in production, send to backend)
  const ideas = JSON.parse(localStorage.getItem('interlinkIdeas') || '[]');
  ideas.push({
    text: input.value,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('interlinkIdeas', JSON.stringify(ideas));
  
  input.value = '';
  showNotification('Thanks for sharing your idea!', 'success');
}

function submitGeneralFeedback() {
  const input = document.getElementById('feedbackInput');
  if (!input?.value.trim()) {
    showNotification('Please enter your feedback', 'error');
    return;
  }
  
  // Store locally (in production, send to backend)
  const feedback = JSON.parse(localStorage.getItem('interlinkGeneralFeedback') || '[]');
  feedback.push({
    text: input.value,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('interlinkGeneralFeedback', JSON.stringify(feedback));
  
  input.value = '';
  showNotification('Thanks for your feedback!', 'success');
}

// ==========================================
// Navigation
// ==========================================

function wireNavigation() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#top') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==========================================
// CTA and Pricing
// ==========================================

function wirePricingButtons() {
  // Pricing buttons are wired via onclick in HTML
}

function wireCTA() {
  // CTA buttons are wired via href in HTML
}

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved feedback
  const savedFeedback = localStorage.getItem('interlinkFeedback');
  if (savedFeedback) {
    try {
      feedbackData = JSON.parse(savedFeedback);
    } catch (e) {
      feedbackData = [];
    }
  }
  
  setYear();
  await fetchModels();
  renderModelSelectors();
  renderParticipants();
  renderPlaygroundResults();
  renderRaceEntries();
  wireHero();
  wirePlayground();
  wireCodeValidation();
  wireRace();
  wirePricingButtons();
  wireCTA();
  wireParticipants();
  wireVoiceControls();
  wireNavigation();
  await initVoiceUI();
  await loadModelUpdates();
  
  // Load voices for TTS
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      populateVoiceOutputSelect(document.getElementById('voiceLanguage')?.value || selectedVoiceLanguage);
      populateChatVoices();
    };
  }
  
  // Wire chat input
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
  
  // Check age verification on first visit (disabled by default for better UX)
  // Uncomment to enable:
  // if (!localStorage.getItem('interlinkAgeVerified')) {
  //   setTimeout(showAgeVerification, 500);
  // } else if (!localStorage.getItem('interlinkTutorialSeen')) {
  //   setTimeout(showTutorial, 1000);
  // }
  
  // Show tutorial for first-time users (optional)
  if (!localStorage.getItem('interlinkTutorialSeen')) {
    setTimeout(showTutorial, 2000);
  }
});

// Make functions globally available
window.selectTutor = selectTutor;
window.endChat = endChat;
window.sendChatMessage = sendChatMessage;
window.toggleChatVoice = toggleChatVoice;
window.showTutorial = showTutorial;
window.closeTutorial = closeTutorial;
window.nextTutorialStep = nextTutorialStep;
window.prevTutorialStep = prevTutorialStep;
window.showRegistration = showRegistration;
window.closeRegistration = closeRegistration;
window.handleRegistration = handleRegistration;
window.verifyAge = verifyAge;
window.submitParentalConsent = submitParentalConsent;
window.closeAgeVerification = closeAgeVerification;
window.submitIdea = submitIdea;
window.submitGeneralFeedback = submitGeneralFeedback;
window.downloadFeedbackCSV = downloadFeedbackCSV;
window.removeUploadedImage = removeUploadedImage;


// ============================================
// ANALYTICS TRACKER MODULE
// ============================================

const AnalyticsTracker = {
  // Storage key
  STORAGE_KEY: 'interlinkAnalytics',
  
  // Initialize analytics data structure
  data: {
    experiments: [],
    modelPerformance: {},
    totalExperiments: 0,
    successfulExperiments: 0,
    totalLatency: 0,
    modelsUsed: new Set(),
    sessionStart: null
  },
  
  // Initialize the tracker
  init() {
    this.loadFromStorage();
    this.data.sessionStart = new Date().toISOString();
    this.updateDashboard();
    this.wireAnalyticsEvents();
  },
  
  // Load data from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data = {
          ...this.data,
          ...parsed,
          modelsUsed: new Set(parsed.modelsUsed || [])
        };
      }
    } catch (e) {
      console.error('Error loading analytics:', e);
    }
  },
  
  // Save data to localStorage
  saveToStorage() {
    try {
      const toSave = {
        ...this.data,
        modelsUsed: Array.from(this.data.modelsUsed)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Error saving analytics:', e);
    }
  },
  
  // Track an experiment
  trackExperiment(experimentData) {
    const experiment = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      title: experimentData.prompt?.substring(0, 50) + '...' || 'Untitled',
      prompt: experimentData.prompt,
      models: experimentData.models || [],
      results: experimentData.results || [],
      avgLatency: experimentData.avgLatency || 0,
      successRate: experimentData.successRate || 0,
      status: experimentData.successRate >= 70 ? 'success' : experimentData.successRate >= 40 ? 'warning' : 'error'
    };
    
    // Update totals
    this.data.totalExperiments++;
    if (experiment.successRate >= 70) {
      this.data.successfulExperiments++;
    }
    this.data.totalLatency += experiment.avgLatency;
    
    // Track models used
    experiment.models.forEach(m => this.data.modelsUsed.add(m));
    
    // Update model performance
    experiment.results.forEach(result => {
      if (!this.data.modelPerformance[result.model]) {
        this.data.modelPerformance[result.model] = {
          totalRuns: 0,
          successfulRuns: 0,
          totalLatency: 0
        };
      }
      const perf = this.data.modelPerformance[result.model];
      perf.totalRuns++;
      if (result.success) perf.successfulRuns++;
      perf.totalLatency += result.latency || 0;
    });
    
    // Add to experiments list (keep last 100)
    this.data.experiments.unshift(experiment);
    if (this.data.experiments.length > 100) {
      this.data.experiments = this.data.experiments.slice(0, 100);
    }
    
    this.saveToStorage();
    this.updateDashboard();
    this.persistExperiment(experiment);
    
    return experiment;
  },

  async persistExperiment(experiment) {
    try {
      const response = await fetch('/api/analytics/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: experiment.title,
          prompt: experiment.prompt,
          models: experiment.models,
          results: experiment.results,
          avgLatency: experiment.avgLatency,
          successRate: experiment.successRate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Experiment persistence failed with ${response.status}`);
      }

      const savedExperiment = await response.json();
      await this.updateAnalytics();
      window.ABTestingModule?.handleExperimentTracked(savedExperiment, experiment);
    } catch (error) {
      console.warn('Experiment persistence failed, using local analytics only', error);
      window.ABTestingModule?.handleExperimentTracked(null, experiment);
    }
  },

  renderPerformanceChart(metrics = []) {
    const chartContainer = document.getElementById('modelPerformanceChart');
    if (!chartContainer) return;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      chartContainer.innerHTML = `
        <div class="results-placeholder">
          <p>No model performance data yet. Run an experiment in the Playground.</p>
        </div>
      `;
      return;
    }

    const labelMap = {
      openai: 'ChatGPT',
      anthropic: 'Claude',
      gemini: 'Gemini',
      llama: 'Llama',
      kimi: 'Kimi-K2',
      gptoss120b: 'GPT-OSS 120B',
      gptoss20b: 'GPT-OSS 20B',
      compound: 'Compound',
      grok: 'Grok',
    };

    const colorMap = {
      openai: 'chart-bar-openai',
      anthropic: 'chart-bar-claude',
      gemini: 'chart-bar-gemini',
      llama: 'chart-bar-llama',
      kimi: 'chart-bar-kimi',
      gptoss120b: 'chart-bar-gptoss120b',
      gptoss20b: 'chart-bar-gptoss20b',
      compound: 'chart-bar-compound',
      grok: 'chart-bar-openai',
    };

    chartContainer.innerHTML = `
      <div class="chart-bar-container">
        ${metrics.map((metric) => {
          const successRate = Math.round(metric.success_rate || 0);
          const label = labelMap[metric.model_id] || metric.model_id;
          const colorClass = colorMap[metric.model_id] || 'chart-bar-openai';

          return `
            <div class="chart-bar-row">
              <span class="chart-label">${this.escapeHtml(label)}</span>
              <div class="chart-bar-bg"><div class="chart-bar ${colorClass}" style="width: ${successRate}%"></div></div>
              <span class="chart-value">${successRate}%</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderRecentExperiments(experiments = []) {
    const logContainer = document.getElementById('experimentLog');
    if (!logContainer) return;

    if (!Array.isArray(experiments) || experiments.length === 0) {
      logContainer.innerHTML = `
        <div class="experiment-item">
          <div class="experiment-info">
            <div class="experiment-title">No experiments yet</div>
            <div class="experiment-meta">Run your first experiment in the Playground</div>
          </div>
        </div>
      `;
      return;
    }

    logContainer.innerHTML = experiments.map((exp) => {
      const timeAgo = this.getTimeAgo(new Date(exp.created_at || exp.timestamp || Date.now()));
      const successRate = Math.round(exp.success_rate ?? exp.successRate ?? 0);
      const statusClass = successRate >= 70 ? 'status-success' : successRate >= 40 ? 'status-warning' : 'status-error';
      const modelCount = Array.isArray(exp.models) ? exp.models.length : 0;
      const avgLatency = exp.avg_latency ?? exp.avgLatency ?? 0;
      const title = exp.title || (exp.prompt ? `${exp.prompt.substring(0, 50)}...` : 'Untitled');

      return `
        <div class="experiment-item">
          <div class="experiment-status ${statusClass}"></div>
          <div class="experiment-info">
            <div class="experiment-title">${this.escapeHtml(title)}</div>
            <div class="experiment-meta">${modelCount} models • ${avgLatency}ms avg • ${timeAgo}</div>
          </div>
          <div class="experiment-score">${successRate}%</div>
        </div>
      `;
    }).join('');
  },
  
  // Update the dashboard UI
  updateDashboard() {
    this.updateAnalytics();
  },
  
  async updateAnalytics() {
  try {
    const res = await fetch('/api/analytics/summary');
    if (!res.ok) return;
    const data = await res.json();
    
    const totalExpEl = document.getElementById('totalExperiments');
    const successRateEl = document.getElementById('successRate');
    const avgLatencyEl = document.getElementById('avgLatency');
    const modelsUsedEl = document.getElementById('modelsUsed');

    if (totalExpEl) totalExpEl.textContent = data.totalExperiments;
    if (successRateEl) successRateEl.textContent = `${data.successRate}%`;
    if (avgLatencyEl) avgLatencyEl.textContent = `${data.avgLatency}ms`;
    if (modelsUsedEl) modelsUsedEl.textContent = data.modelsUsed;

    this.renderPerformanceChart(data.modelPerformance || []);
    this.renderRecentExperiments(data.recentExperiments || []);
    } catch (err) {
    console.warn('Analytics update failed', err);
    this.updatePerformanceChart();
    this.updateExperimentLog();
  }
  },
  
  // Update the performance chart
  updatePerformanceChart() {
    const chartContainer = document.getElementById('modelPerformanceChart');
    if (!chartContainer) return;
    
    const modelColors = {
      'openai': 'chart-bar-openai',
      'anthropic': 'chart-bar-claude',
      'gemini': 'chart-bar-gemini',
      'llama': 'chart-bar-llama',
      'mistral': 'chart-bar-mistral',
      'deepseek': 'chart-bar-deepseek',
      'kimi': 'chart-bar-kimi',
      'qwen': 'chart-bar-qwen',
      'gptoss120b': 'chart-bar-gptoss120b',
      'gptoss20b': 'chart-bar-gptoss20b',
      'compound': 'chart-bar-compound',
      'cohere': 'chart-bar-cohere'
    };
    
    const modelLabels = {
      'openai': 'ChatGPT',
      'anthropic': 'Claude',
      'gemini': 'Gemini',
      'llama': 'Llama',
      'mistral': 'Mistral',
      'deepseek': 'DeepSeek',
      'kimi': 'Kimi-K2',
      'qwen': 'Qwen',
      'gptoss120b': 'GPT-OSS 120B',
      'gptoss20b': 'GPT-OSS 20B',
      'compound': 'Compound',
      'cohere': 'Command R+'
    };
    
    // If we have real data, use it
    if (Object.keys(this.data.modelPerformance).length > 0) {
      let html = '<div class="chart-bar-container">';
      
      Object.entries(this.data.modelPerformance).forEach(([model, perf]) => {
        const successRate = perf.totalRuns > 0 
          ? Math.round((perf.successfulRuns / perf.totalRuns) * 100)
          : 0;
        const colorClass = modelColors[model] || 'chart-bar-openai';
        const label = modelLabels[model] || model;
        
        html += `
          <div class="chart-bar-row">
            <span class="chart-label">${label}</span>
            <div class="chart-bar-bg"><div class="chart-bar ${colorClass}" style="width: ${successRate}%"></div></div>
            <span class="chart-value">${successRate}%</span>
          </div>
        `;
      });
      
      html += '</div>';
      chartContainer.innerHTML = html;
    }
  },
  
  // Update experiment log
  updateExperimentLog() {
    const logContainer = document.getElementById('experimentLog');
    if (!logContainer) return;
    
    if (this.data.experiments.length === 0) {
      logContainer.innerHTML = `
        <div class="experiment-item">
          <div class="experiment-info">
            <div class="experiment-title">No experiments yet</div>
            <div class="experiment-meta">Run your first experiment in the Playground</div>
          </div>
        </div>
      `;
      return;
    }
    
    const recentExperiments = this.data.experiments.slice(0, 10);
    
    logContainer.innerHTML = recentExperiments.map(exp => {
      const timeAgo = this.getTimeAgo(new Date(exp.timestamp));
      const statusClass = exp.status === 'success' ? 'status-success' : 
                         exp.status === 'warning' ? 'status-warning' : 'status-error';
      
      return `
        <div class="experiment-item" onclick="AnalyticsTracker.showExperimentDetails('${exp.id}')">
          <div class="experiment-status ${statusClass}"></div>
          <div class="experiment-info">
            <div class="experiment-title">${this.escapeHtml(exp.title)}</div>
            <div class="experiment-meta">${exp.models.length} models • ${exp.avgLatency}ms avg • ${timeAgo}</div>
          </div>
          <div class="experiment-score">${Math.round(exp.successRate)}%</div>
        </div>
      `;
    }).join('');
  },
  
  // Show experiment details
  showExperimentDetails(id) {
    const exp = this.data.experiments.find(e => e.id === parseInt(id));
    if (!exp) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2>Experiment Details</h2>
        <div class="experiment-details">
          <p><strong>Time:</strong> ${new Date(exp.timestamp).toLocaleString()}</p>
          <p><strong>Models:</strong> ${exp.models.join(', ')}</p>
          <p><strong>Avg Latency:</strong> ${exp.avgLatency}ms</p>
          <p><strong>Success Rate:</strong> ${Math.round(exp.successRate)}%</p>
          <p><strong>Prompt:</strong></p>
          <pre style="background: var(--bg-contrast); padding: 12px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap;">${this.escapeHtml(exp.prompt || 'N/A')}</pre>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  // Export analytics data
  async exportAnalytics() {
    try {
      const response = await fetch('/api/analytics/export');
      if (!response.ok) {
        throw new Error(`Export failed with ${response.status}`);
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interlink-analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showNotification('Analytics exported successfully!', 'success');
      return;
    } catch (error) {
      console.warn('Backend analytics export failed, using local data', error);
    }

    const data = {
      exportDate: new Date().toISOString(),
      summary: {
        totalExperiments: this.data.totalExperiments,
        successRate: this.data.totalExperiments > 0 
          ? Math.round((this.data.successfulExperiments / this.data.totalExperiments) * 100)
          : 0,
        avgLatency: this.data.totalExperiments > 0
          ? Math.round(this.data.totalLatency / this.data.totalExperiments)
          : 0,
        modelsUsed: Array.from(this.data.modelsUsed)
      },
      modelPerformance: this.data.modelPerformance,
      experiments: this.data.experiments
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interlink-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Analytics exported successfully!', 'success');
  },
  
  // Wire analytics events
  wireAnalyticsEvents() {
    const exportBtn = document.getElementById('exportAnalytics');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAnalytics());
    }
    
    const timeRangeSelect = document.getElementById('analyticsTimeRange');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => this.filterByTimeRange(e.target.value));
    }
  },
  
  // Filter by time range
  filterByTimeRange(range) {
    // This would filter the displayed data based on time range
    // For now, just update the dashboard
    this.updateDashboard();
  },
  
  // Utility: Get time ago string
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return date.toLocaleDateString();
  },
  
  // Utility: Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ============================================
// WORKFLOW TRACKER MODULE
// ============================================

const WorkflowTracker = {
  STORAGE_KEY: 'interlinkWorkflow',
  
  data: {
    promptKits: [],
    deployments: [],
    stages: {
      development: { experiments: 0, pendingReview: 0 },
      staging: { inTesting: 0, readyForProd: 0 },
      production: { activePrompts: 0, uptime: 99.2 }
    }
  },
  
  init() {
    this.loadFromStorage();
    this.updateDashboard();
    this.wireWorkflowEvents();
  },
  
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading workflow data:', e);
    }
  },
  
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving workflow data:', e);
    }
  },
  
  // Create a new prompt kit
  createPromptKit(name, prompt, models) {
    const kit = {
      id: Date.now(),
      name,
      prompt,
      models,
      stage: 'development',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    this.data.promptKits.push(kit);
    this.data.stages.development.experiments++;
    this.saveToStorage();
    this.updateDashboard();
    this.persistPromptKit(kit);
    window.ABTestingModule?.loadPromptKits();
    
    showNotification(`Prompt kit "${name}" created!`, 'success');
    return kit;
  },

  async persistPromptKit(kit) {
    try {
      const response = await fetch('/api/workflow/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: kit.name,
          prompt: kit.prompt,
          models: kit.models,
        }),
      });

      if (!response.ok) {
        throw new Error(`Prompt kit persistence failed with ${response.status}`);
      }
    } catch (error) {
      console.warn('Prompt kit persistence failed, using local workflow data only', error);
    }
  },
  
  // Promote a prompt kit to the next stage
  promoteKit(kitId) {
    const kit = this.data.promptKits.find(k => k.id === kitId);
    if (!kit) return;
    
    const stageOrder = ['development', 'staging', 'production'];
    const currentIndex = stageOrder.indexOf(kit.stage);
    
    if (currentIndex < stageOrder.length - 1) {
      const oldStage = kit.stage;
      kit.stage = stageOrder[currentIndex + 1];
      kit.updatedAt = new Date().toISOString();
      
      // Update stage counts
      if (oldStage === 'development') {
        this.data.stages.development.experiments--;
        this.data.stages.staging.inTesting++;
      } else if (oldStage === 'staging') {
        this.data.stages.staging.inTesting--;
        this.data.stages.production.activePrompts++;
      }
      
      // Add deployment record
      this.data.deployments.unshift({
        id: Date.now(),
        name: kit.name,
        stage: kit.stage,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
      
      this.saveToStorage();
      this.updateDashboard();
      
      showNotification(`"${kit.name}" promoted to ${kit.stage}!`, 'success');
    }
  },
  
  // Rollback a prompt kit
  rollbackKit(kitId) {
    const kit = this.data.promptKits.find(k => k.id === kitId);
    if (!kit || kit.stage === 'development') return;
    
    const stageOrder = ['development', 'staging', 'production'];
    const currentIndex = stageOrder.indexOf(kit.stage);
    
    const oldStage = kit.stage;
    kit.stage = stageOrder[currentIndex - 1];
    kit.updatedAt = new Date().toISOString();
    
    // Update stage counts
    if (oldStage === 'production') {
      this.data.stages.production.activePrompts--;
      this.data.stages.staging.inTesting++;
    } else if (oldStage === 'staging') {
      this.data.stages.staging.inTesting--;
      this.data.stages.development.experiments++;
    }
    
    this.saveToStorage();
    this.updateDashboard();
    
    showNotification(`"${kit.name}" rolled back to ${kit.stage}`, 'info');
  },
  
  updateDashboard() {
    // Update stage stats
    const stages = this.data.stages;
    
    // Development stage
    const devExperiments = document.querySelector('[data-stage="dev"] .stat-num');
    const devPending = document.querySelectorAll('[data-stage="dev"] .stat-num')[1];
    if (devExperiments) devExperiments.textContent = stages.development.experiments;
    if (devPending) devPending.textContent = stages.development.pendingReview;
    
    // Staging stage
    const stagingTesting = document.querySelector('[data-stage="staging"] .stat-num');
    const stagingReady = document.querySelectorAll('[data-stage="staging"] .stat-num')[1];
    if (stagingTesting) stagingTesting.textContent = stages.staging.inTesting;
    if (stagingReady) stagingReady.textContent = stages.staging.readyForProd;
    
    // Production stage
    const prodActive = document.querySelector('[data-stage="production"] .stat-num');
    const prodUptime = document.querySelectorAll('[data-stage="production"] .stat-num')[1];
    if (prodActive) prodActive.textContent = stages.production.activePrompts;
    if (prodUptime) prodUptime.textContent = stages.production.uptime + '%';
    
    // Update deployment list
    this.updateDeploymentList();
  },
  
  updateDeploymentList() {
    const listContainer = document.querySelector('.deployment-list');
    if (!listContainer) return;
    
    if (this.data.deployments.length === 0) {
      listContainer.innerHTML = `
        <div class="deployment-item">
          <div class="deployment-info">
            <span class="deployment-name">No deployments yet</span>
            <span class="deployment-time">Create your first prompt kit</span>
          </div>
        </div>
      `;
      return;
    }
    
    const recentDeployments = this.data.deployments.slice(0, 5);
    
    listContainer.innerHTML = recentDeployments.map(dep => {
      const timeAgo = AnalyticsTracker.getTimeAgo(new Date(dep.timestamp));
      const statusClass = dep.status === 'success' ? 'status-success' : 
                         dep.status === 'pending' ? 'status-pending' : 'status-warning';
      
      return `
        <div class="deployment-item">
          <div class="deployment-status ${statusClass}"></div>
          <div class="deployment-info">
            <span class="deployment-name">${dep.name}</span>
            <span class="deployment-time">${timeAgo}</span>
          </div>
          <span class="deployment-env">${dep.stage}</span>
        </div>
      `;
    }).join('');
  },
  
  wireWorkflowEvents() {
    // Wire up quick action buttons
    const newKitBtn = document.querySelector('.quick-actions .btn:first-child');
    if (newKitBtn) {
      newKitBtn.addEventListener('click', () => this.showCreateKitModal());
    }
  },
  
  showCreateKitModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2>Create New Prompt Kit</h2>
        <div class="field-group">
          <label for="kitName">Kit Name</label>
          <input type="text" id="kitName" class="input" placeholder="e.g., Code Review Assistant" />
        </div>
        <div class="field-group">
          <label for="kitPrompt">Base Prompt</label>
          <textarea id="kitPrompt" class="input" rows="4" placeholder="Enter your prompt template..."></textarea>
        </div>
        <button class="btn btn-primary full" onclick="WorkflowTracker.createKitFromModal(this.closest('.modal'))">Create Kit</button>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  createKitFromModal(modal) {
    const name = document.getElementById('kitName')?.value;
    const prompt = document.getElementById('kitPrompt')?.value;
    
    if (!name || !prompt) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    this.createPromptKit(name, prompt, ['openai', 'anthropic']);
    modal.remove();
  }
};

// Initialize analytics and workflow on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(() => {
    AnalyticsTracker.init();
    WorkflowTracker.init();
  }, 500);
});

// Make modules globally available
window.AnalyticsTracker = AnalyticsTracker;
window.WorkflowTracker = WorkflowTracker;

// Hook into playground results to track experiments
const originalRenderPlaygroundResults = window.renderPlaygroundResults || function() {};
window.renderPlaygroundResults = function() {
  originalRenderPlaygroundResults.apply(this, arguments);
  
  // Track experiment if we have results
  if (lastPlaygroundResults && lastPlaygroundResults.length > 0) {
    const prompt = document.getElementById('playgroundPrompt')?.value || '';
    const models = lastPlaygroundResults.map(r => r.id);
    const avgLatency = Math.round(lastPlaygroundResults.reduce((sum, r) => sum + (r.latency || 1500), 0) / lastPlaygroundResults.length);
    const successRate = (lastPlaygroundResults.filter(r => r.text && r.text !== '-' && !r.text.includes('error')).length / lastPlaygroundResults.length) * 100;
    
    const results = lastPlaygroundResults.map(r => ({
      model: r.id,
      success: r.text && r.text !== '-' && !r.text.includes('error'),
      latency: r.latency || 1500
    }));
    
    AnalyticsTracker.trackExperiment({
      prompt,
      models,
      results,
      avgLatency,
      successRate
    });
  }
};


// =============================================
// A/B TESTING MODULE
// =============================================

const starterPromptKits = [
  {
    id: 'starter-code-review-baseline',
    name: 'Code Review Baseline',
    prompt: 'Review this code for correctness, maintainability, and security issues. Be concise.',
    models: ['openai', 'anthropic'],
    stage: 'development',
  },
  {
    id: 'starter-code-review-structured',
    name: 'Code Review Structured',
    prompt: 'Review this code and respond with three sections: Risks, Fixes, and Priority. Focus on security and production-readiness.',
    models: ['openai', 'anthropic'],
    stage: 'development',
  },
  {
    id: 'starter-research-summary',
    name: 'Research Summary v1',
    prompt: 'Summarize the material, extract the key risks, and recommend the next actions in bullet points.',
    models: ['openai', 'anthropic', 'gemini'],
    stage: 'development',
  },
];

const ABTestingModule = {
  tests: [],
  currentUser: null,
  promptKits: [],
  pendingRun: null,
  
  init() {
    this.loadPromptKits();
    this.loadTests();
    this.setupEventListeners();
    this.initTrafficSplitSlider();
  },

  normalizeTest(test) {
    if (!test) return null;

    const resultMap = { A: { total: 0, successes: 0, avgLatency: 0 }, B: { total: 0, successes: 0, avgLatency: 0 } };
    if (Array.isArray(test.results)) {
      test.results.forEach((entry) => {
        if (entry.variant && resultMap[entry.variant]) {
          resultMap[entry.variant] = {
            total: entry.total || 0,
            successes: entry.successes || 0,
            avgLatency: Math.round(entry.avg_latency || entry.avgLatency || 0),
            avgRating: entry.avg_rating || entry.avgRating || null,
          };
        }
      });
    } else if (test.results?.A && test.results?.B) {
      resultMap.A = { ...resultMap.A, ...test.results.A };
      resultMap.B = { ...resultMap.B, ...test.results.B };
    }

    return {
      id: test.id,
      name: test.name,
      status: test.status || 'draft',
      variantAId: test.variantAId || test.variant_a_id || test.variantA?.id,
      variantBId: test.variantBId || test.variant_b_id || test.variantB?.id,
      variantA: test.variantA || null,
      variantB: test.variantB || null,
      trafficSplit: test.trafficSplit || test.traffic_split || 0.5,
      minSamples: test.minSamples || test.min_samples || 100,
      metricType: test.metricType || test.metric_type || 'success_rate',
      createdAt: test.createdAt || test.created_at,
      startedAt: test.startedAt || test.started_at,
      endedAt: test.endedAt || test.ended_at,
      winner: test.winner || null,
      results: resultMap,
      statistics: test.statistics || null,
    };
  },

  async loadPromptKits() {
    try {
      const response = await fetch('/api/workflow/kits');
      if (response.ok) {
        const kits = await response.json();
        this.promptKits = Array.isArray(kits) && kits.length ? kits : starterPromptKits;
        this.populatePromptKitSelects();
        return;
      }
    } catch (error) {
      console.warn('Prompt kit fetch failed, using local workflow kits', error);
    }

    this.promptKits = (window.WorkflowTracker?.data?.promptKits || []).length
      ? window.WorkflowTracker.data.promptKits
      : starterPromptKits;
    this.populatePromptKitSelects();
  },

  populatePromptKitSelects() {
    const selects = [
      document.getElementById('variantAKit'),
      document.getElementById('variantBKit'),
    ];

    selects.forEach((select) => {
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = '<option value="">Select a prompt kit...</option>' + this.promptKits.map((kit) => (
        `<option value="${kit.id}">${escapeHtml(kit.name)}</option>`
      )).join('');

      if (currentValue && this.promptKits.some((kit) => String(kit.id) === String(currentValue))) {
        select.value = currentValue;
      }
    });
  },
  
  setupEventListeners() {
    // Create A/B test button
    const createBtn = document.getElementById('createABTest');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.createTest());
    }
    
    // Filter dropdown
    const filterSelect = document.getElementById('abTestFilter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => this.filterTests(e.target.value));
    }
  },
  
  initTrafficSplitSlider() {
    const slider = document.getElementById('trafficSplit');
    const splitA = document.getElementById('splitA');
    const splitB = document.getElementById('splitB');
    
    if (slider && splitA && splitB) {
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        splitA.textContent = `${value}%`;
        splitB.textContent = `${100 - value}%`;
      });
    }
  },
  
  async loadTests() {
    try {
      const response = await fetch('/api/ab-tests');
      if (response.ok) {
        const tests = await response.json();
        this.tests = await Promise.all(tests.map((test) => this.hydrateTest(test)));
        this.renderTests();
        return;
      }
    } catch (error) {
      console.warn('Using local A/B test data', error);
    }

    this.tests = this.getLocalTests().map((test) => this.normalizeTest(test));
    this.renderTests();
  },

  async hydrateTest(test) {
    const normalized = this.normalizeTest(test);

    try {
      const response = await fetch(`/api/ab-tests/${normalized.id}`);
      if (!response.ok) {
        return normalized;
      }

      const details = await response.json();
      return this.normalizeTest({
        ...normalized,
        ...details,
        results: details.results,
        statistics: details.statistics,
        variantA: details.variantA || normalized.variantA,
        variantB: details.variantB || normalized.variantB,
      });
    } catch (error) {
      return normalized;
    }
  },
  
  getLocalTests() {
    return JSON.parse(localStorage.getItem('abTests') || '[]');
  },
  
  saveLocalTests() {
    localStorage.setItem('abTests', JSON.stringify(this.tests));
  },
  
  async createTest() {
    const name = document.getElementById('abTestName')?.value;
    const variantAId = document.getElementById('variantAKit')?.value;
    const variantBId = document.getElementById('variantBKit')?.value;
    const trafficSplit = parseInt(document.getElementById('trafficSplit')?.value || 50) / 100;
    const minSamples = parseInt(document.getElementById('minSamples')?.value || 100);
    const metricType = document.getElementById('metricType')?.value || 'success_rate';
    
    if (!name) {
      showNotification('Please enter a test name', 'error');
      return;
    }

    if (!variantAId || !variantBId) {
      showNotification('Please select both prompt kit variants', 'error');
      return;
    }

    if (variantAId === variantBId) {
      showNotification('Variant A and Variant B must be different prompt kits', 'error');
      return;
    }
    
    const test = {
      id: 'test_' + Date.now(),
      name,
      variantAId: variantAId || 'variant_a',
      variantBId: variantBId || 'variant_b',
      trafficSplit,
      minSamples,
      metricType,
      status: 'draft',
      createdAt: new Date().toISOString(),
      results: {
        A: { total: 0, successes: 0, avgLatency: 0 },
        B: { total: 0, successes: 0, avgLatency: 0 }
      }
    };
    
    try {
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });
      
      if (response.ok) {
        const savedTest = await response.json();
        this.tests.unshift(await this.hydrateTest(savedTest));
      } else {
        this.tests.unshift(this.normalizeTest(test));
        this.saveLocalTests();
      }
    } catch (error) {
      this.tests.unshift(this.normalizeTest(test));
      this.saveLocalTests();
    }
    
    this.renderTests();
    showNotification('A/B test created successfully!', 'success');
    
    // Clear form
    document.getElementById('abTestName').value = '';
  },
  
  async startTest(testId) {
    const test = this.tests.find(t => t.id === testId);
    if (!test) return;
    
    test.status = 'running';
    test.startedAt = new Date().toISOString();
    
    try {
      const response = await fetch(`/api/ab-tests/${testId}/start`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Start failed with ${response.status}`);
      }
    } catch (error) {
      this.saveLocalTests();
    }
    
    this.renderTests();
    showNotification('A/B test started!', 'success');
  },
  
  async endTest(testId) {
    const test = this.tests.find(t => t.id === testId);
    if (!test) return;
    
    test.status = 'completed';
    test.endedAt = new Date().toISOString();
    
    // Determine winner
    const rateA = test.results.A.total > 0 ? test.results.A.successes / test.results.A.total : 0;
    const rateB = test.results.B.total > 0 ? test.results.B.successes / test.results.B.total : 0;
    test.winner = rateB > rateA ? 'B' : (rateA > rateB ? 'A' : null);
    
    try {
      const response = await fetch(`/api/ab-tests/${testId}/end`, { method: 'POST' });
      if (response.ok) {
        const payload = await response.json();
        test.winner = payload.winner || test.winner;
        test.statistics = payload.statistics || test.statistics;
      } else {
        throw new Error(`End failed with ${response.status}`);
      }
    } catch (error) {
      this.saveLocalTests();
    }
    
    this.renderTests();
    showNotification(`A/B test completed! ${test.winner ? `Variant ${test.winner} wins!` : 'No clear winner.'}`, 'success');
  },
  
  async recordResult(testId, variant, success, latencyMs, experimentId = null) {
    const test = this.tests.find(t => t.id === testId);
    if (!test || test.status !== 'running') return;
    
    test.results[variant].total++;
    if (success) test.results[variant].successes++;
    test.results[variant].avgLatency = 
      (test.results[variant].avgLatency * (test.results[variant].total - 1) + latencyMs) / test.results[variant].total;
    
    try {
      const response = await fetch(`/api/ab-tests/${testId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant,
          experimentId,
          success,
          latencyMs,
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload.autoEnded) {
          test.status = 'completed';
          test.winner = payload.winner || test.winner;
          test.statistics = payload.statistics || test.statistics;
        }
      } else {
        throw new Error(`Result recording failed with ${response.status}`);
      }
    } catch (error) {
      this.saveLocalTests();
    }

    this.saveLocalTests();
    this.renderTests();
    
    // Check if we should auto-end
    const totalSamples = test.results.A.total + test.results.B.total;
    if (totalSamples >= test.minSamples) {
      this.checkStatisticalSignificance(test);
    }
  },

  findPromptKit(kitId) {
    return this.promptKits.find((kit) => String(kit.id) === String(kitId))
      || window.WorkflowTracker?.data?.promptKits?.find((kit) => String(kit.id) === String(kitId))
      || null;
  },

  prepareVariantRun(testId, variant) {
    const test = this.tests.find((entry) => entry.id === testId);
    if (!test) return;

    const kitId = variant === 'A' ? test.variantAId : test.variantBId;
    const promptKit = this.findPromptKit(kitId);
    if (!promptKit) {
      showNotification('Prompt kit not found for this variant', 'error');
      return;
    }

    const promptEl = document.getElementById('playgroundPrompt');
    if (promptEl) {
      promptEl.value = promptKit.prompt || '';
    }

    const selectedModels = Array.isArray(promptKit.models) ? promptKit.models : [];
    if (selectedModels.length) {
      const toggles = document.querySelectorAll('#model-toggles input[type="checkbox"]');
      toggles.forEach((toggle) => {
        toggle.checked = selectedModels.includes(toggle.value);
      });
    }

    this.pendingRun = {
      testId,
      variant,
      promptKitId: kitId,
      prompt: promptKit.prompt || '',
    };

    const section = document.getElementById('playground');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showNotification(`Loaded Variant ${variant} into the Playground`, 'info');
  },

  handleExperimentTracked(savedExperiment, localExperiment) {
    if (!this.pendingRun) return;

    const experiment = savedExperiment || localExperiment;
    const successRate = experiment?.success_rate ?? experiment?.successRate ?? 0;
    const avgLatency = experiment?.avg_latency ?? experiment?.avgLatency ?? 0;
    const success = successRate >= 70;

    this.recordResult(
      this.pendingRun.testId,
      this.pendingRun.variant,
      success,
      avgLatency,
      experiment?.id || null
    );

    this.pendingRun = null;
  },

  formatPercent(value) {
    return `${Math.round((value || 0) * 100)}%`;
  },

  getStatisticsSummary(test) {
    if (test.statistics) {
      return test.statistics;
    }

    const variantA = test.results?.A || { total: 0, successes: 0, avgLatency: 0 };
    const variantB = test.results?.B || { total: 0, successes: 0, avgLatency: 0 };
    const rateA = variantA.total > 0 ? variantA.successes / variantA.total : 0;
    const rateB = variantB.total > 0 ? variantB.successes / variantB.total : 0;

    return {
      variantA: {
        total: variantA.total,
        successes: variantA.successes,
        rate: rateA,
        avgLatency: variantA.avgLatency || 0,
      },
      variantB: {
        total: variantB.total,
        successes: variantB.successes,
        rate: rateB,
        avgLatency: variantB.avgLatency || 0,
      },
      difference: rateB - rateA,
      relativeImprovement: rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0,
      pValue: null,
      isSignificant: false,
      recommendedWinner: rateB > rateA ? 'B' : rateA > rateB ? 'A' : null,
    };
  },
  
  checkStatisticalSignificance(test) {
    const nA = test.results.A.total;
    const nB = test.results.B.total;
    if (nA < 10 || nB < 10) return;
    
    const pA = test.results.A.successes / nA;
    const pB = test.results.B.successes / nB;
    const pooledP = (test.results.A.successes + test.results.B.successes) / (nA + nB);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/nA + 1/nB));
    const zScore = se > 0 ? Math.abs(pB - pA) / se : 0;
    
    // 95% confidence = z-score > 1.96
    if (zScore > 1.96) {
      showNotification('Statistical significance reached! Consider ending the test.', 'info');
    }
  },
  
  filterTests(status) {
    this.renderTests(status === 'all' ? null : status);
  },
  
  renderTests(filterStatus = null) {
    const container = document.getElementById('abTestsList');
    if (!container) return;
    
    const filteredTests = filterStatus 
      ? this.tests.filter(t => t.status === filterStatus)
      : this.tests;
    
    if (filteredTests.length === 0) {
      container.innerHTML = `
        <div class="no-tests-message" style="text-align: center; padding: 2rem; color: var(--muted);">
          <p>No A/B tests yet. Create one to get started!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = filteredTests.map(test => this.renderTestCard(test)).join('');
    
    // Add event listeners
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const testId = e.target.dataset.testId;
        if (action === 'start') this.startTest(testId);
        else if (action === 'end') this.endTest(testId);
        else if (action === 'view') this.viewTestDetails(testId);
        else if (action === 'run-a') this.prepareVariantRun(testId, 'A');
        else if (action === 'run-b') this.prepareVariantRun(testId, 'B');
      });
    });
  },
  
  renderTestCard(test) {
    const totalSamples = test.results.A.total + test.results.B.total;
    const progress = Math.min((totalSamples / test.minSamples) * 100, 100);
    const rateA = test.results.A.total > 0 ? Math.round((test.results.A.successes / test.results.A.total) * 100) : 0;
    const rateB = test.results.B.total > 0 ? Math.round((test.results.B.successes / test.results.B.total) * 100) : 0;
    const diff = rateB - rateA;
    
    if (test.status === 'completed') {
      return `
        <div class="ab-test-card ab-test-completed">
          <div class="ab-test-header">
            <span class="ab-test-name">${test.name}</span>
            <span class="ab-test-status status-completed">Completed</span>
          </div>
          <div class="ab-test-winner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <span>${test.winner ? `Variant ${test.winner} won with ${test.winner === 'A' ? rateA : rateB}% success rate` : 'No clear winner'}</span>
          </div>
          <div class="ab-test-stats">
            <div class="stat-item">
              <span class="stat-label">Improvement</span>
              <span class="stat-value ${diff > 0 ? 'positive' : diff < 0 ? 'negative' : ''}">${diff > 0 ? '+' : ''}${diff}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Samples</span>
              <span class="stat-value">${totalSamples}</span>
            </div>
          </div>
          <div class="ab-test-actions">
            <button class="btn btn-sm btn-ghost" data-action="view" data-test-id="${test.id}">View Report</button>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="ab-test-card ab-test-${test.status}">
        <div class="ab-test-header">
          <span class="ab-test-name">${test.name}</span>
          <span class="ab-test-status status-${test.status}">${test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span>
        </div>
        ${test.status === 'running' ? `
          <div class="ab-test-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${totalSamples}/${test.minSamples} samples</span>
          </div>
          <div class="ab-test-results-preview">
            <div class="result-preview">
              <span class="variant-tag variant-a-tag">A</span>
              <span class="result-value">${rateA}%</span>
            </div>
            <div class="result-preview">
              <span class="variant-tag variant-b-tag">B</span>
              <span class="result-value">${rateB}%</span>
              ${diff !== 0 ? `<span class="result-badge ${diff > 0 ? 'winner' : ''}">${diff > 0 ? '+' : ''}${diff}%</span>` : ''}
            </div>
          </div>
        ` : ''}
        <div class="ab-test-actions">
          <button class="btn btn-sm btn-ghost" data-action="view" data-test-id="${test.id}">View Details</button>
          ${test.status === 'running' ? `<button class="btn btn-sm btn-ghost" data-action="run-a" data-test-id="${test.id}">Run A</button>` : ''}
          ${test.status === 'running' ? `<button class="btn btn-sm btn-ghost" data-action="run-b" data-test-id="${test.id}">Run B</button>` : ''}
          ${test.status === 'draft' ? `<button class="btn btn-sm btn-primary" data-action="start" data-test-id="${test.id}">Start Test</button>` : ''}
          ${test.status === 'running' ? `<button class="btn btn-sm btn-outline" data-action="end" data-test-id="${test.id}">End Test</button>` : ''}
        </div>
      </div>
    `;
  },
  
  viewTestDetails(testId) {
    const test = this.tests.find(t => t.id === testId);
    if (!test) return;

    const stats = this.getStatisticsSummary(test);
    const variantAName = test.variantA?.name || this.findPromptKit(test.variantAId)?.name || 'Variant A';
    const variantBName = test.variantB?.name || this.findPromptKit(test.variantBId)?.name || 'Variant B';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 760px;">
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2>${escapeHtml(test.name)} Report</h2>
        <div class="experiment-details">
          <p><strong>Status:</strong> ${escapeHtml(test.status)}</p>
          <p><strong>Primary Metric:</strong> ${escapeHtml(test.metricType || 'success_rate')}</p>
          <p><strong>Winner:</strong> ${escapeHtml(stats.recommendedWinner ? `Variant ${stats.recommendedWinner}` : 'No clear winner')}</p>
          <div class="ab-test-stats" style="margin-top: 16px;">
            <div class="stat-item">
              <span class="stat-label">${escapeHtml(variantAName)}</span>
              <span class="stat-value">${this.formatPercent(stats.variantA.rate)} (${stats.variantA.total} samples)</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">${escapeHtml(variantBName)}</span>
              <span class="stat-value">${this.formatPercent(stats.variantB.rate)} (${stats.variantB.total} samples)</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Relative Improvement</span>
              <span class="stat-value ${stats.relativeImprovement > 0 ? 'positive' : stats.relativeImprovement < 0 ? 'negative' : ''}">${stats.relativeImprovement > 0 ? '+' : ''}${Math.round(stats.relativeImprovement || 0)}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">P-Value</span>
              <span class="stat-value">${stats.pValue != null ? Number(stats.pValue).toFixed(3) : 'Not enough data'}</span>
            </div>
          </div>
          <p style="margin-top: 16px;"><strong>Confidence:</strong> ${stats.isSignificant ? 'Statistically significant at the configured threshold.' : 'More samples may be required for significance.'}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
};

// =============================================
// CI/CD PIPELINE MODULE
// =============================================

const PipelineModule = {
  pipelines: [],
  runs: [],
  promptKits: [],
  
  init() {
    this.loadPromptKits();
    this.loadPipelines();
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    const createBtn = document.getElementById('createPipeline');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.createPipeline());
    }
  },

  async loadPromptKits() {
    try {
      const response = await fetch('/api/workflow/kits');
      if (response.ok) {
        const kits = await response.json();
        this.promptKits = Array.isArray(kits) && kits.length ? kits : starterPromptKits;
        this.populatePromptKitSelect();
        return;
      }
    } catch (error) {
      console.warn('Pipeline prompt kit fetch failed, using fallback kits', error);
    }

    this.promptKits = window.ABTestingModule?.promptKits?.length
      ? window.ABTestingModule.promptKits
      : starterPromptKits;
    this.populatePromptKitSelect();
  },

  populatePromptKitSelect() {
    const select = document.getElementById('pipelineKit');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Select a prompt kit...</option>' + this.promptKits.map((kit) => (
      `<option value="${kit.id}">${escapeHtml(kit.name)}</option>`
    )).join('');

    if (currentValue && this.promptKits.some((kit) => String(kit.id) === String(currentValue))) {
      select.value = currentValue;
    }
  },
  
  async loadPipelines() {
    try {
      const response = await fetch('/api/pipelines');
      if (response.ok) {
        this.pipelines = await response.json();
        this.renderPipelines();
      }
    } catch (error) {
      console.log('Using local pipeline data');
      this.pipelines = this.getLocalPipelines();
      this.renderPipelines();
    }
  },
  
  getLocalPipelines() {
    return JSON.parse(localStorage.getItem('pipelines') || '[]');
  },
  
  saveLocalPipelines() {
    localStorage.setItem('pipelines', JSON.stringify(this.pipelines));
  },
  
  async createPipeline() {
    const name = document.getElementById('pipelineName')?.value;
    const kitId = document.getElementById('pipelineKit')?.value;
    
    if (!name) {
      showNotification('Please enter a pipeline name', 'error');
      return;
    }

    if (!kitId) {
      showNotification('Please select a prompt kit', 'error');
      return;
    }
    
    const stages = [];
    if (document.getElementById('stageLint')?.checked) stages.push({ name: 'lint', enabled: true });
    if (document.getElementById('stageTest')?.checked) stages.push({ name: 'test', enabled: true });
    if (document.getElementById('stageBenchmark')?.checked) stages.push({ name: 'benchmark', enabled: true });
    if (document.getElementById('stageDeploy')?.checked) stages.push({ name: 'deploy', enabled: true });
    
    const pipeline = {
      id: 'pipeline_' + Date.now(),
      name,
      kitId: kitId || 'default',
      config: { stages },
      status: 'idle',
      createdAt: new Date().toISOString(),
      runs: []
    };
    
    try {
      const response = await fetch('/api/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipeline)
      });
      
      if (response.ok) {
        const savedPipeline = await response.json();
        this.pipelines.unshift(savedPipeline);
      } else {
        this.pipelines.unshift(pipeline);
        this.saveLocalPipelines();
      }
    } catch (error) {
      this.pipelines.unshift(pipeline);
      this.saveLocalPipelines();
    }
    
    this.renderPipelines();
    showNotification('Pipeline created successfully!', 'success');
    document.getElementById('pipelineName').value = '';
  },
  
  async runPipeline(pipelineId) {
    const pipeline = this.pipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;
    
    pipeline.status = 'running';
    
    const run = {
      id: 'run_' + Date.now(),
      pipelineId,
      status: 'running',
      stages: pipeline.config.stages.map(s => ({ ...s, status: 'pending' })),
      startedAt: new Date().toISOString(),
      logs: []
    };
    
    pipeline.runs = pipeline.runs || [];
    pipeline.runs.unshift(run);
    this.saveLocalPipelines();
    this.renderPipelines();
    
    // Simulate pipeline execution
    await this.simulatePipelineRun(pipeline, run);
  },
  
  async simulatePipelineRun(pipeline, run) {
    for (let i = 0; i < run.stages.length; i++) {
      run.stages[i].status = 'running';
      this.renderPipelines();
      
      // Simulate stage execution
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        run.stages[i].status = 'completed';
        run.logs.push(`[${run.stages[i].name}] Completed successfully`);
      } else {
        run.stages[i].status = 'failed';
        run.logs.push(`[${run.stages[i].name}] Failed: Simulated error`);
        
        // Mark remaining stages as skipped
        for (let j = i + 1; j < run.stages.length; j++) {
          run.stages[j].status = 'skipped';
        }
        
        run.status = 'failed';
        pipeline.status = 'idle';
        this.saveLocalPipelines();
        this.renderPipelines();
        showNotification(`Pipeline failed at ${run.stages[i].name} stage`, 'error');
        return;
      }
      
      this.saveLocalPipelines();
      this.renderPipelines();
    }
    
    run.status = 'completed';
    run.completedAt = new Date().toISOString();
    pipeline.status = 'idle';
    this.saveLocalPipelines();
    this.renderPipelines();
    showNotification('Pipeline completed successfully!', 'success');
  },
  
  cancelRun(pipelineId, runId) {
    const pipeline = this.pipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;
    
    const run = pipeline.runs.find(r => r.id === runId);
    if (!run || run.status !== 'running') return;
    
    run.status = 'cancelled';
    run.stages.forEach(s => {
      if (s.status === 'running' || s.status === 'pending') {
        s.status = 'cancelled';
      }
    });
    
    pipeline.status = 'idle';
    this.saveLocalPipelines();
    this.renderPipelines();
    showNotification('Pipeline run cancelled', 'info');
  },
  
  renderPipelines() {
    const container = document.getElementById('pipelinesList');
    if (!container) return;
    
    if (this.pipelines.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--muted);">
          <p>No pipelines yet. Create one to automate your prompt testing!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.pipelines.slice(0, 5).map(pipeline => {
      const latestRun = pipeline.runs?.[0];
      return this.renderPipelineCard(pipeline, latestRun);
    }).join('');
    
    // Add event listeners
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const pipelineId = e.target.dataset.pipelineId;
        const runId = e.target.dataset.runId;
        
        if (action === 'run') this.runPipeline(pipelineId);
        else if (action === 'cancel') this.cancelRun(pipelineId, runId);
        else if (action === 'logs') this.viewLogs(pipelineId, runId);
      });
    });
  },
  
  renderPipelineCard(pipeline, latestRun) {
    const stages = latestRun?.stages || pipeline.config.stages.map(s => ({ ...s, status: 'pending' }));
    
    return `
      <div class="pipeline-card ${latestRun?.status === 'completed' ? 'pipeline-completed' : ''}">
        <div class="pipeline-header">
          <div class="pipeline-info">
            <span class="pipeline-name">${pipeline.name}</span>
            <span class="pipeline-kit">${pipeline.kitId}</span>
          </div>
          <span class="pipeline-status status-${latestRun?.status || 'idle'}">
            ${latestRun?.status === 'running' ? '<span class="status-dot"></span>' : ''}
            ${latestRun?.status === 'completed' ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ` : ''}
            ${(latestRun?.status || 'Idle').charAt(0).toUpperCase() + (latestRun?.status || 'idle').slice(1)}
          </span>
        </div>
        <div class="pipeline-stages">
          ${stages.map((stage, i) => `
            <div class="pipeline-stage-item ${stage.status}">
              <div class="stage-indicator">
                ${stage.status === 'completed' ? `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ` : stage.status === 'running' ? '<div class="spinner-sm"></div>' : ''}
              </div>
              <span>${stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}</span>
            </div>
            ${i < stages.length - 1 ? `<div class="stage-connector ${stage.status}"></div>` : ''}
          `).join('')}
        </div>
        <div class="pipeline-actions">
          ${latestRun?.status === 'running' ? `
            <button class="btn btn-sm btn-ghost" data-action="logs" data-pipeline-id="${pipeline.id}" data-run-id="${latestRun.id}">View Logs</button>
            <button class="btn btn-sm btn-outline btn-danger" data-action="cancel" data-pipeline-id="${pipeline.id}" data-run-id="${latestRun.id}">Cancel</button>
          ` : `
            <button class="btn btn-sm btn-ghost" data-action="logs" data-pipeline-id="${pipeline.id}">View Logs</button>
            <button class="btn btn-sm btn-primary" data-action="run" data-pipeline-id="${pipeline.id}">Run Pipeline</button>
          `}
        </div>
        ${latestRun?.status === 'completed' ? `
          <div class="pipeline-meta">
            <span>Completed ${this.formatTimeAgo(latestRun.completedAt)}</span>
          </div>
        ` : ''}
      </div>
    `;
  },
  
  viewLogs(pipelineId, runId) {
    const pipeline = this.pipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;
    
    const run = runId ? pipeline.runs.find(r => r.id === runId) : pipeline.runs?.[0];
    const logs = run?.logs?.join('\n') || 'No logs available';
    
    showNotification(`Pipeline logs:\n${logs}`, 'info');
  },
  
  formatTimeAgo(dateStr) {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} days ago`;
  }
};

// =============================================
// COLLABORATION MODULE
// =============================================

const CollaborationModule = {
  socket: null,
  currentTeam: null,
  currentUser: null,
  activeUsers: [],
  
  init() {
    this.loadUser();
    this.setupEventListeners();
    this.initSocket();
  },
  
  loadUser() {
    const savedUser = localStorage.getItem('interlinkUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    } else {
      this.currentUser = {
        id: 'user_' + Date.now(),
        name: 'You',
        email: '',
        avatar: 'Y'
      };
      localStorage.setItem('interlinkUser', JSON.stringify(this.currentUser));
    }
  },
  
  setupEventListeners() {
    const createTeamBtn = document.getElementById('createTeam');
    if (createTeamBtn) {
      createTeamBtn.addEventListener('click', () => this.createTeam());
    }
    
    const inviteBtn = document.getElementById('inviteMember');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => this.inviteMember());
    }
    
    const sendChatBtn = document.getElementById('sendTeamChat');
    if (sendChatBtn) {
      sendChatBtn.addEventListener('click', () => this.sendChatMessage());
    }
    
    const chatInput = document.getElementById('teamChatInput');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendChatMessage();
      });
    }
  },
  
  initSocket() {
    // Try to connect to Socket.IO
    if (typeof io !== 'undefined') {
      try {
        this.socket = io();
        
        this.socket.on('connect', () => {
          console.log('Connected to collaboration server');
          if (this.currentTeam) {
            this.joinTeam(this.currentTeam.id);
          }
        });
        
        this.socket.on('user-joined', (data) => {
          this.activeUsers = data.activeUsers;
          this.renderTeamMembers();
          this.addActivityItem(`${data.userName} joined the team`);
        });
        
        this.socket.on('user-left', (data) => {
          this.activeUsers = data.activeUsers;
          this.renderTeamMembers();
        });
        
        this.socket.on('team-message', (data) => {
          this.addChatMessage(data.userName, data.message);
        });
        
        this.socket.on('experiment-completed', (data) => {
          this.addActivityItem(`${data.userName} completed an experiment`);
        });
        
      } catch (error) {
        console.log('Socket.IO not available, using local mode');
      }
    }
  },
  
  async createTeam() {
    const nameInput = document.getElementById('teamName');
    const name = nameInput?.value;
    
    if (!name) {
      showNotification('Please enter a team name', 'error');
      return;
    }
    
    const team = {
      id: 'team_' + Date.now(),
      name,
      members: [this.currentUser],
      createdAt: new Date().toISOString()
    };
    
    this.currentTeam = team;
    localStorage.setItem('interlinkTeam', JSON.stringify(team));
    
    if (this.socket) {
      this.socket.emit('join-team', {
        teamId: team.id,
        userId: this.currentUser.id,
        userName: this.currentUser.name
      });
    }
    
    this.renderTeamMembers();
    showNotification(`Team "${name}" created!`, 'success');
    nameInput.value = '';
    
    // Hide no team message
    const noTeamMsg = document.getElementById('noTeamMessage');
    if (noTeamMsg) noTeamMsg.style.display = 'none';
  },
  
  joinTeam(teamId) {
    if (this.socket && this.currentUser) {
      this.socket.emit('join-team', {
        teamId,
        userId: this.currentUser.id,
        userName: this.currentUser.name
      });
    }
  },
  
  inviteMember() {
    const emailInput = document.getElementById('inviteEmail');
    const email = emailInput?.value;
    
    if (!email) {
      showNotification('Please enter an email address', 'error');
      return;
    }
    
    showNotification(`Invitation sent to ${email}`, 'success');
    emailInput.value = '';
  },
  
  sendChatMessage() {
    const input = document.getElementById('teamChatInput');
    const message = input?.value?.trim();
    
    if (!message) return;
    
    if (this.socket && this.currentTeam) {
      this.socket.emit('team-message', {
        teamId: this.currentTeam.id,
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        message
      });
    }
    
    this.addChatMessage(this.currentUser.name, message);
    input.value = '';
  },
  
  addChatMessage(author, text) {
    const container = document.getElementById('teamChatMessages');
    if (!container) return;
    
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message';
    msgEl.innerHTML = `
      <span class="chat-author">${author}:</span>
      <span class="chat-text">${text}</span>
    `;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
  },
  
  addActivityItem(text) {
    const container = document.getElementById('activityFeed');
    if (!container) return;
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-avatar"><span>•</span></div>
      <div class="activity-content">${text}</div>
      <span class="activity-time">just now</span>
    `;
    container.insertBefore(item, container.firstChild);
  },
  
  renderTeamMembers() {
    const container = document.getElementById('teamMembers');
    if (!container) return;
    
    const members = this.activeUsers.length > 0 ? this.activeUsers : (this.currentTeam?.members || [this.currentUser]);
    
    container.innerHTML = members.map(member => `
      <div class="member-item">
        <div class="member-avatar online">
          <span>${member.name?.charAt(0) || member.avatar || '?'}</span>
          <span class="online-indicator"></span>
        </div>
        <div class="member-info">
          <span class="member-name">${member.name}</span>
          <span class="member-role">${member.id === this.currentUser?.id ? 'You' : 'Member'}</span>
        </div>
      </div>
    `).join('');
  }
};

// =============================================
// TIME-SERIES CHARTS MODULE
// =============================================

const TimeSeriesModule = {
  chart: null,
  selectedModels: ['openai', 'anthropic', 'gemini'],
  timeRange: '24h',
  metric: 'latency',
  
  init() {
    this.setupEventListeners();
    this.initChart();
    this.loadData();
  },
  
  setupEventListeners() {
    const rangeSelect = document.getElementById('timeseriesRange');
    if (rangeSelect) {
      rangeSelect.addEventListener('change', (e) => {
        this.timeRange = e.target.value;
        this.loadData();
      });
    }
    
    const metricSelect = document.getElementById('timeseriesMetric');
    if (metricSelect) {
      metricSelect.addEventListener('change', (e) => {
        this.metric = e.target.value;
        this.loadData();
      });
    }
    
    const modelToggles = document.querySelectorAll('.toggle-mini');
    modelToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const model = toggle.dataset.model;
        toggle.classList.toggle('active');
        
        if (toggle.classList.contains('active')) {
          if (!this.selectedModels.includes(model)) {
            this.selectedModels.push(model);
          }
        } else {
          this.selectedModels = this.selectedModels.filter(m => m !== model);
        }
        
        this.updateChart();
      });
    });
  },
  
  initChart() {
    const canvas = document.getElementById('timeseriesChart');
    if (!canvas) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      // Load Chart.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.createChart(canvas);
      document.head.appendChild(script);
    } else {
      this.createChart(canvas);
    }
  },
  
  createChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 15, 26, 0.9)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(148, 163, 184, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          y: {
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        }
      }
    });
    
    this.loadData();
  },
  
  async loadData() {
    // Generate sample data
    const data = this.generateSampleData();
    this.updateChart(data);
    this.updateSummary(data);
  },
  
  generateSampleData() {
    const modelColors = {
      openai: '#10a37f',
      anthropic: '#6B4FBB',
      gemini: '#4285f4',
      llama: '#0084ff',
      mistral: '#ff6b35',
      deepseek: '#00d4aa'
    };
    
    const points = this.timeRange === '24h' ? 24 : 
                   this.timeRange === '7d' ? 7 :
                   this.timeRange === '30d' ? 30 : 90;
    
    const labels = [];
    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      if (this.timeRange === '24h') {
        const d = new Date(now - i * 3600000);
        labels.push(d.getHours() + ':00');
      } else {
        const d = new Date(now - i * 86400000);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    
    const datasets = {};
    
    this.selectedModels.forEach(model => {
      const baseValue = this.metric === 'latency' ? 1500 + Math.random() * 1000 :
                        this.metric === 'success_rate' ? 85 + Math.random() * 10 :
                        this.metric === 'requests' ? 50 + Math.random() * 100 :
                        1000 + Math.random() * 500;
      
      datasets[model] = {
        label: model.charAt(0).toUpperCase() + model.slice(1),
        data: Array(points).fill(0).map(() => {
          const variation = (Math.random() - 0.5) * baseValue * 0.3;
          return Math.max(0, baseValue + variation);
        }),
        borderColor: modelColors[model] || '#3b82f6',
        backgroundColor: (modelColors[model] || '#3b82f6') + '20',
        tension: 0.4,
        fill: true
      };
    });
    
    return { labels, datasets };
  },
  
  updateChart(data) {
    if (!this.chart) return;
    
    if (data) {
      this.chart.data.labels = data.labels;
      this.chart.data.datasets = Object.values(data.datasets);
    }
    
    this.chart.update();
  },
  
  updateSummary(data) {
    // Calculate summary stats
    let totalLatency = 0;
    let totalSuccess = 0;
    let totalRequests = 0;
    let modelCount = 0;
    let bestModel = null;
    let bestRate = 0;
    
    Object.entries(data.datasets).forEach(([model, dataset]) => {
      const avg = dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length;
      
      if (this.metric === 'latency') {
        totalLatency += avg;
      } else if (this.metric === 'success_rate') {
        totalSuccess += avg;
        if (avg > bestRate) {
          bestRate = avg;
          bestModel = model;
        }
      } else if (this.metric === 'requests') {
        totalRequests += dataset.data.reduce((a, b) => a + b, 0);
      }
      modelCount++;
    });
    
    // Update summary cards
    const avgLatencyEl = document.getElementById('avgLatencySummary');
    if (avgLatencyEl) {
      avgLatencyEl.textContent = (totalLatency / modelCount / 1000).toFixed(1) + 's';
    }
    
    const successRateEl = document.getElementById('successRateSummary');
    if (successRateEl) {
      successRateEl.textContent = (totalSuccess / modelCount).toFixed(1) + '%';
    }
    
    const totalRequestsEl = document.getElementById('totalRequestsSummary');
    if (totalRequestsEl) {
      totalRequestsEl.textContent = Math.round(totalRequests).toLocaleString();
    }
    
    const bestPerformerEl = document.getElementById('bestPerformerSummary');
    if (bestPerformerEl && bestModel) {
      bestPerformerEl.textContent = bestModel.charAt(0).toUpperCase() + bestModel.slice(1);
    }
  }
};

// =============================================
// INITIALIZE ALL MODULES
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize new modules after a short delay
  setTimeout(() => {
    ABTestingModule.init();
    PipelineModule.init();
    CollaborationModule.init();
    TimeSeriesModule.init();
  }, 600);
});

// Make modules globally available
window.ABTestingModule = ABTestingModule;
window.PipelineModule = PipelineModule;
window.CollaborationModule = CollaborationModule;
window.TimeSeriesModule = TimeSeriesModule;
