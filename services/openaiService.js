const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt) {
  if (!prompt) return '';
  if (!OPENAI_API_KEY) {
    return `[stub: openai] ${prompt}`;
  }
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Interlink AI. Keep responses concise.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data?.choices?.[0]?.message?.content?.trim() || 'No response from OpenAI.';
  } catch (err) {
    console.error('OpenAI error', err.response?.data || err.message);
    return '[stub: openai error] Unable to reach OpenAI. Check API key and model.';
  }
}

module.exports = { callOpenAI };
