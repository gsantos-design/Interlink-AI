
const axios = require('axios');
const key = process.env.GEMINI_API_KEY;

async function list() {
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log('Available Gemini Models:', res.data.models.map(m => m.name));
  } catch (err) {
    console.error('Failed to list models:', err.response?.data || err.message);
  }
}
list();
