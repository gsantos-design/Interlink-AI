
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt, imageData = null) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key is missing. Please check your environment configuration.');
  }

  try {
    const parts = [{ text: prompt }];
    
    if (imageData) {
      const base64Data = imageData.split(',')[1] || imageData;
      let mimeType = 'image/jpeg';
      if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
      else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';
      
      parts.unshift({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    throw new Error(`Gemini Error: ${err.response?.data?.error?.message || err.message}`);
  }
}

module.exports = { callGemini };
