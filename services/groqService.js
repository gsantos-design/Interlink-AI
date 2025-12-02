const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
  if (!prompt) return '';
  if (!GROQ_API_KEY) {
    return `[stub: llama] ${prompt}`;
  }
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );
    const text = res.data?.choices?.[0]?.message?.content || '';
    return text.trim() || 'No response from Llama.';
  } catch (err) {
    console.error('Groq/Llama error:', err.response?.data || err.message);
    const errorMsg = err.response?.data?.error?.message || err.message;
    return `[Llama error] ${errorMsg}`;
  }
}

module.exports = { callGroq };
