
const axios = require('axios');

// Support both Groq and xAI keys
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;

const MODEL_MAP = {
  // Groq Models
  'llama': 'llama-3.3-70b-versatile',
  'mixtral': 'mixtral-8x7b-32768',
  'gemma': 'gemma-7b-it',
  'gptoss120b': 'mixtral-8x7b-32768', // Mapping generic OSS to Mixtral on Groq
  'gptoss20b': 'gemma-7b-it',         // Mapping generic OSS to Gemma on Groq
  
  // xAI Models
  'grok': 'grok-beta',
  'compound': 'grok-beta' // Mapping compound to Grok for now
};

async function callGroq(prompt, modelKey = 'llama') {
  const model = MODEL_MAP[modelKey] || 'llama-3.3-70b-versatile';
  
  // Check if this is an xAI model
  const isGrok = model.includes('grok');

  if (isGrok) {
    if (!XAI_API_KEY) throw new Error('xAI API Key is missing.');
    try {
      const response = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          model: 'grok-beta',
          messages: [
            { role: 'system', content: 'You are Grok, an AI modeled after the Hitchhiker\'s Guide to the Galaxy.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${XAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('xAI API Error:', error.response?.data || error.message);
      throw new Error(`xAI Error: ${error.response?.data?.error?.message || error.message}`);
    }
  } else {
    // Use Groq
    if (!GROQ_API_KEY) throw new Error('Groq API Key is missing.');
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: model,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      throw new Error(`Groq Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = { callGroq };
