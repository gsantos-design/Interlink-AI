const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Map of supported Groq models with their API identifiers
const GROQ_MODELS = {
  'llama': 'llama-3.3-70b-versatile',
  'kimi': 'k2-0905',
  'gptoss120b': 'gpt-oss-120b',
  'gptoss20b': 'gpt-oss-20b',
  'compound': 'compound-beta'
};

async function callGroq(prompt, modelKey = 'llama') {
  if (!prompt) return '';
  if (!GROQ_API_KEY) {
    return `[stub: ${modelKey}] ${prompt}`;
  }
  
  // Get the actual model identifier or default to llama
  const modelId = GROQ_MODELS[modelKey] || GROQ_MODELS['llama'];
  const modelName = modelKey.charAt(0).toUpperCase() + modelKey.slice(1);
  
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: modelId,
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
    return text.trim() || `No response from ${modelName}.`;
  } catch (err) {
    console.error(`Groq/${modelName} error:`, err.response?.data || err.message);
    const errorMsg = err.response?.data?.error?.message || err.message;
    return `[${modelName} error] ${errorMsg}`;
  }
}

module.exports = { callGroq };
