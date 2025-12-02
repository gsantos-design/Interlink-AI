const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt, imageData = null) {
  if (!prompt) return '';
  if (!OPENAI_API_KEY) {
    return `[stub: openai] ${prompt}`;
  }
  try {
    const userContent = imageData 
      ? [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageData } }
        ]
      : prompt;

    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: imageData ? 'gpt-4o' : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Interlink AI. Keep responses concise.' },
          { role: 'user', content: userContent },
        ],
        max_tokens: 500,
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
    return '[OpenAI error] ' + (err.response?.data?.error?.message || err.message);
  }
}

module.exports = { callOpenAI };
