const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt) {
  if (!prompt) return '';
  if (!GEMINI_API_KEY) {
    return `[stub: gemini] ${prompt}`;
  }
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const parts = res.data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text).filter(Boolean).join(' ');
    return text?.trim() || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini error', err.response?.data || err.message);
    return '[stub: gemini error] Unable to reach Gemini. Check API key and model.';
  }
}

module.exports = { callGemini };
