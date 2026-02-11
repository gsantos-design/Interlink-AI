
const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callAnthropic(prompt, imageData = null) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API Key is missing. Please check your environment configuration.');
  }

  try {
    const content = [];
    if (imageData) {
      const base64Data = imageData.split(',')[1] || imageData;
      let mediaType = 'image/jpeg';
      if (imageData.startsWith('data:image/png')) mediaType = 'image/png';
      else if (imageData.startsWith('data:image/webp')) mediaType = 'image/webp';
      else if (imageData.startsWith('data:image/gif')) mediaType = 'image/gif';
      
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
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 60000,
      }
    );
    return res.data.content[0].text;
  } catch (err) {
    console.error('Anthropic API Error:', err.response?.data || err.message);
    throw new Error(`Anthropic Error: ${err.response?.data?.error?.message || err.message}`);
  }
}

module.exports = { callAnthropic };
