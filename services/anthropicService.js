const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callAnthropic(prompt) {
  if (!prompt) return '';
  if (!ANTHROPIC_API_KEY) {
    return `[stub: anthropic] ${prompt}`;
  }
  try {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    return res.data?.content?.[0]?.text?.trim() || 'No response from Claude.';
  } catch (err) {
    console.error('Anthropic error', err.response?.data || err.message);
    return '[stub: anthropic error] Unable to reach Anthropic. Check API key and model.';
  }
}

module.exports = { callAnthropic };
