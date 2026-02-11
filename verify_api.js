
const axios = require('axios');

async function verifyOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log('❌ OpenAI: Key MISSING');
    return;
  }
  try {
    await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 5
    }, {
      headers: { 'Authorization': `Bearer ${key}` }
    });
    console.log('✅ OpenAI: Connected');
  } catch (err) {
    console.log(`❌ OpenAI: Failed (${err.response?.status || err.message})`);
    if (err.response?.status === 401) console.log('   -> Invalid Key');
    if (err.response?.status === 429) console.log('   -> Quota Exceeded');
  }
}

async function verifyAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.log('❌ Anthropic: Key MISSING');
    return;
  }
  try {
    await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'ping' }]
    }, {
      headers: { 
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      }
    });
    console.log('✅ Anthropic: Connected');
  } catch (err) {
    console.log(`❌ Anthropic: Failed (${err.response?.status || err.message})`);
  }
}

async function run() {
  console.log('--- API Verification ---');
  await verifyOpenAI();
  await verifyAnthropic();
  console.log('------------------------');
}

run();
