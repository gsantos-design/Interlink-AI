const express = require('express');
const { callOpenAI } = require('../services/openaiService');
const { callAnthropic } = require('../services/anthropicService');
const { callGemini } = require('../services/geminiService');
const { callGroq } = require('../services/groqService');
const { contentFilterMiddleware } = require('../middleware/contentFilter');

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

router.post('/', contentFilterMiddleware, async (req, res) => {
  const { model, prompt, image } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const target = normalizeModel(model);
  
  // Vision support note
  if (image && !['openai', 'anthropic', 'gemini'].includes(target)) {
    return res.json({ reply: `[Note: ${target} doesn't support vision yet. Image analysis available with ChatGPT, Claude, and Gemini.]` });
  }

  try {
    let reply;
    switch (target) {
      case 'openai':
        reply = await callOpenAI(prompt, image);
        break;
      case 'anthropic':
        reply = await callAnthropic(prompt, image);
        break;
      case 'gemini':
        reply = await callGemini(prompt, image);
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
