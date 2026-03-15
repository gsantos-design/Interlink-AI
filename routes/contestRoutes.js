const express = require('express');
const { callOpenAI } = require('../services/openaiService');
const { callAnthropic } = require('../services/anthropicService');
const { callGemini } = require('../services/geminiService');
const { callGroq } = require('../services/groqService');

const router = express.Router();

const modelConfig = {
  openai: { label: 'ChatGPT', fn: callOpenAI },
  anthropic: { label: 'Claude', fn: callAnthropic },
  gemini: { label: 'Gemini', fn: callGemini },
  llama: { label: 'Llama', fn: (prompt) => callGroq(prompt, 'llama') },
  kimi: { label: 'Kimi', fn: (prompt) => callGroq(prompt, 'kimi') },
  gptoss120b: { label: 'GPT-OSS 120B', fn: (prompt) => callGroq(prompt, 'gptoss120b') },
  gptoss20b: { label: 'GPT-OSS 20B', fn: (prompt) => callGroq(prompt, 'gptoss20b') },
  compound: { label: 'Compound', fn: (prompt) => callGroq(prompt, 'compound') },
  grok: { label: 'Grok', fn: (prompt) => callGroq(prompt, 'grok') },
};

function normalize(model) {
  if (!model) return null;
  const key = model.toLowerCase();
  if (['gpt', 'chatgpt', 'openai'].includes(key)) return 'openai';
  if (['claude', 'anthropic'].includes(key)) return 'anthropic';
  if (['gemini', 'google'].includes(key)) return 'gemini';
  if (['llama', 'groq', 'meta'].includes(key)) return 'llama';
  if (['kimi', 'kimi-k2'].includes(key)) return 'kimi';
  if (['gptoss120b', 'gpt-oss-120b'].includes(key)) return 'gptoss120b';
  if (['gptoss20b', 'gpt-oss-20b'].includes(key)) return 'gptoss20b';
  if (['compound', 'compound-beta'].includes(key)) return 'compound';
  if (['grok', 'xai'].includes(key)) return 'grok';
  return null;
}

async function runOne(modelId, prompt) {
  const info = modelConfig[modelId];
  if (!info) {
    return { model: modelId, latencyMs: 0, text: `[unsupported model: ${modelId}]`, error: true };
  }
  const started = Date.now();
  try {
    const text = await info.fn(prompt);
    const isError = text && (text.startsWith('[stub:') || text.startsWith('[error') || text.startsWith('[Gemini error]'));
    return { model: info.label, latencyMs: Date.now() - started, text, error: isError };
  } catch (err) {
    return {
      model: info.label,
      latencyMs: Date.now() - started,
      text: `[error] ${err.message || 'unknown error'}`,
      error: true,
    };
  }
}

router.post('/', async (req, res) => {
  const { prompt, models } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const normalized = (Array.isArray(models) ? models : [])
    .map(normalize)
    .filter(Boolean);
  const chosen = normalized.length ? normalized : ['openai', 'anthropic', 'gemini', 'llama'];

  try {
    const start = Date.now();
    const results = await Promise.all(chosen.map((m) => runOne(m, prompt)));
    const totalLatencyMs = Date.now() - start;
    return res.json({ results, totalLatencyMs });
  } catch (err) {
    console.error('Contest route error', err);
    return res.status(500).json({ error: 'Server error in /api/contest' });
  }
});

module.exports = router;
