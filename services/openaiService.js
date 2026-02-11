
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt, imageData = null) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API Key is missing. Please check your environment configuration.');
  }

  try {
    const messages = [
      { role: 'system', content: 'You are a helpful, professional AI assistant.' },
      { role: 'user', content: prompt }
    ];

    if (imageData) {
      messages[1].content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageData } }
      ];
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60s timeout for enterprise workloads
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error(`OpenAI Error: ${error.response?.data?.error?.message || error.message}`);
  }
}

module.exports = { callOpenAI };
