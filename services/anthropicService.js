const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callAnthropic(prompt, imageData = null) {
  if (!prompt) return '';
  if (!ANTHROPIC_API_KEY) {
    return `[stub: anthropic] ${prompt}`;
  }
  try {
    const content = [];
    if (imageData) {
      const base64Data = imageData.split(',')[1] || imageData;
      // Auto-detect image format from data URL
      let mediaType = 'image/jpeg';
      if (imageData.startsWith('data:image/png')) {
        mediaType = 'image/png';
      } else if (imageData.startsWith('data:image/webp')) {
        mediaType = 'image/webp';
      } else if (imageData.startsWith('data:image/gif')) {
        mediaType = 'image/gif';
      }
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      });
    }
    content.push({ type: 'text', text: prompt });

    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 500,
        messages: [{ role: 'user', content }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return res.data?.content?.[0]?.text?.trim() || 'No response from Claude.';
  } catch (err) {
    console.error('Anthropic error', err.response?.data || err.message);
    return '[Claude error] ' + (err.response?.data?.error?.message || err.message);
  }
}

module.exports = { callAnthropic };
