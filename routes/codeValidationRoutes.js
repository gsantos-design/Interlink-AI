const express = require('express');
const { validateCode, normalizeChecks, normalizeProviders } = require('../services/codeValidationService');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    code,
    language,
    filename,
    repoUrl,
    context,
    checks,
    providers,
  } = req.body || {};

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'code is required' });
  }

  if (code.length > 50000) {
    return res.status(413).json({ error: 'code payload is too large' });
  }

  try {
    const response = await validateCode({
      code: code.trim(),
      language: language || 'text',
      filename: filename || 'snippet',
      repoUrl,
      context,
      checks: normalizeChecks(checks),
      providers: normalizeProviders(providers),
    });

    if (response.results.length === 0) {
      return res.status(502).json({
        error: 'No validation provider succeeded',
        ...response,
      });
    }

    return res.json(response);
  } catch (error) {
    console.error('Code validation route error:', error);
    return res.status(500).json({ error: error.message || 'Server error in /api/validate/code' });
  }
});

module.exports = router;
