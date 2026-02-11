
const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/chat';

async function testModel(modelId, name) {
  try {
    const start = Date.now();
    const res = await axios.post(BASE_URL, {
      model: modelId,
      prompt: 'Say "Verified" and nothing else.'
    });
    const duration = Date.now() - start;
    console.log(`✅ ${name} (${modelId}): Success (${duration}ms) -> "${res.data.reply}"`);
  } catch (err) {
    console.log(`❌ ${name} (${modelId}): Failed - ${err.response?.data?.error || err.message}`);
  }
}

async function run() {
  console.log('--- LIVE MODEL VERIFICATION ---');
  await testModel('openai', 'ChatGPT');
  await testModel('anthropic', 'Claude');
  await testModel('gemini', 'Gemini');
  await testModel('grok', 'Grok (xAI)');
  await testModel('llama', 'Llama (Groq)');
  console.log('-------------------------------');
}

run();
