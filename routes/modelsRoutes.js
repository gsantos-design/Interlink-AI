const express = require('express');

const router = express.Router();

const models = [
  { id: 'openai', label: 'ChatGPT (OpenAI)' },
  { id: 'anthropic', label: 'Claude (Anthropic)' },
  { id: 'gemini', label: 'Gemini (Google)' },
];

router.get('/', (req, res) => {
  res.json({ models });
});

module.exports = router;
