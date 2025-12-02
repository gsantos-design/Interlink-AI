const express = require('express');
const router = express.Router();

// In-memory storage for feedback (replace with database in production)
const feedbackStore = [];

router.post('/', (req, res) => {
  const { model, prompt, response, rating, notes, issues } = req.body || {};
  
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
  };

  feedbackStore.push(feedback);
  console.log('Feedback received:', { model, rating, issues });
  
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

module.exports = router;
