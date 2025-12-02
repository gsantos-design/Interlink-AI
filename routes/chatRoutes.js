const express = require('express');
const { callOpenAI } = require('../services/openaiService');
const { callAnthropic } = require('../services/anthropicService');
const { callGemini } = require('../services/geminiService');
const { callGroq } = require('../services/groqService');

const router = express.Router();

function normalizeModel(model) {
  if (!model) return 'openai';
  const key = model.toLowerCase();
  if (['gpt', 'chatgpt', 'openai'].includes(key)) return 'openai';
  if (['claude', 'anthropic'].includes(key)) return 'anthropic';
  if (['gemini', 'google'].includes(key)) return 'gemini';
  if (['llama', 'groq', 'meta'].includes(key)) return 'llama';
  return key;
}

router.post('/', async (req, res) => {
  const { model, prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const target = normalizeModel(model);
  try {
    let reply;
    switch (target) {
      case 'openai':
        reply = await callOpenAI(prompt);
        break;
      case 'anthropic':
        reply = await callAnthropic(prompt);
        break;
      case 'gemini':
        reply = await callGemini(prompt);
        break;
      case 'llama':
        reply = await callGroq(prompt);
        break;
      default:
        return res.status(400).json({ error: `Unsupported model: ${target}` });
    }
    return res.json({ reply });
  } catch (err) {
    console.error('Chat route error', err);
    return res.status(500).json({ error: 'Server error in /api/chat' });
  }
});

module.exports = router;
