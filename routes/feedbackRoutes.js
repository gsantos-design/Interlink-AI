const express = require('express');
const router = express.Router();

// In-memory storage for feedback (replace with database in production)
const feedbackStore = [];

router.post('/', (req, res) => {
  const { 
    model, 
    prompt, 
    response, 
    rating, 
    notes, 
    issues,
    hallucinationSeverity,
    confidenceCalibration,
    consistencyScore,
    deceptionFlag
  } = req.body || {};
  
  if (!model || !rating) {
    return res.status(400).json({ error: 'model and rating are required' });
  }

  const feedback = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    model,
    prompt: prompt || '',
    response: response || '',
    rating, // 1-5 stars or thumbs up/down
    notes: notes || '',
    issues: issues || [], // e.g., ['overconfident', 'wrong', 'refused', 'hallucinated']
    hallucinationSeverity: hallucinationSeverity || 0, // 1-5 scale
    confidenceCalibration: confidenceCalibration || 0, // 1-5 scale
    consistencyScore: consistencyScore || 0, // 1-5 scale
    deceptionFlag: deceptionFlag || false, // boolean
  };

  feedbackStore.push(feedback);
  console.log('Feedback received:', { model, rating, issues, hallucinationSeverity, deceptionFlag });
  
  res.json({ success: true, feedbackId: feedback.id });
});

router.get('/stats', (req, res) => {
  // Calculate stats per model
  const stats = {};
  
  feedbackStore.forEach((fb) => {
    if (!stats[fb.model]) {
      stats[fb.model] = {
        total: 0,
        ratings: [],
        issues: {},
      };
    }
    stats[fb.model].total++;
    stats[fb.model].ratings.push(fb.rating);
    
    if (Array.isArray(fb.issues)) {
      fb.issues.forEach((issue) => {
        stats[fb.model].issues[issue] = (stats[fb.model].issues[issue] || 0) + 1;
      });
    }
  });

  // Calculate averages
  Object.keys(stats).forEach((model) => {
    const ratings = stats[model].ratings;
    stats[model].avgRating = ratings.length 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : 0;
  });

  res.json({ stats, totalFeedback: feedbackStore.length });
});

router.get('/download', (req, res) => {
  if (feedbackStore.length === 0) {
    return res.status(404).send('No feedback data available');
  }

  // CSV headers
  const headers = [
    'Timestamp',
    'Model',
    'Rating',
    'Issues',
    'Hallucination_Severity',
    'Confidence_Calibration',
    'Consistency_Score',
    'Deception_Flag',
    'Notes',
    'Prompt',
    'Response'
  ];

  // CSV rows
  const rows = feedbackStore.map((fb) => [
    fb.timestamp || '',
    fb.model || '',
    fb.rating || '',
    Array.isArray(fb.issues) ? fb.issues.join('; ') : '',
    fb.hallucinationSeverity || '',
    fb.confidenceCalibration || '',
    fb.consistencyScore || '',
    fb.deceptionFlag ? 'YES' : 'NO',
    (fb.notes || '').replace(/"/g, '""'),
    (fb.prompt || '').replace(/"/g, '""'),
    (fb.response || '').replace(/"/g, '""'),
  ]);

  // Build CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="interlink-feedback-${Date.now()}.csv"`);
  res.send(csvContent);
});

module.exports = router;
