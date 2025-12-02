const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt, imageData = null) {
  if (!prompt) return '';
  if (!GEMINI_API_KEY) {
    return `[stub: gemini] ${prompt}`;
  }
  try {
    const parts = [{ text: prompt }];
    if (imageData) {
      const base64Data = imageData.split(',')[1] || imageData;
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Data,
        },
      });
    }

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    const responseParts = res.data?.candidates?.[0]?.content?.parts || [];
    const text = responseParts.map((p) => p.text).filter(Boolean).join(' ');
    return text?.trim() || 'No response from Gemini.';
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    const errorMsg = err.response?.data?.error?.message || err.message;
    return `[Gemini error] ${errorMsg}`;
  }
}

module.exports = { callGemini };
