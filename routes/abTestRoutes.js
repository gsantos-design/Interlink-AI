const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// A/B Test Routes
// ==========================================

// Create A/B test
router.post('/', (req, res) => {
  try {
    const {
      name,
      description,
      variantAId,
      variantBId,
      trafficSplit,
      metricType,
      minSamples,
      confidenceLevel,
      createdBy,
      teamId
    } = req.body;
    
    if (!name || !variantAId || !variantBId) {
      return res.status(400).json({ error: 'Name and both variant IDs are required' });
    }
    
    // Verify variants exist
    const variantA = db.getPromptKit(variantAId);
    const variantB = db.getPromptKit(variantBId);
    
    if (!variantA || !variantB) {
      return res.status(404).json({ error: 'One or both variants not found' });
    }
    
    const test = db.createABTest({
      name,
      description,
      variantAId,
      variantBId,
      trafficSplit: trafficSplit || 0.5,
      metricType: metricType || 'success_rate',
      minSamples: minSamples || 100,
      confidenceLevel: confidenceLevel || 0.95,
      createdBy,
      teamId
    });
    
    // Log activity
    if (teamId && createdBy) {
      db.logActivity(createdBy, teamId, 'created', 'ab_test', test.id, { name });
    }
    
    res.json({
      ...test,
      variantA: { id: variantA.id, name: variantA.name },
      variantB: { id: variantB.id, name: variantB.name }
    });
  } catch (error) {
    console.error('Create A/B test error:', error);
    res.status(500).json({ error: 'Failed to create A/B test' });
  }
});

// Get all A/B tests
router.get('/', (req, res) => {
  try {
    const { teamId, status } = req.query;
    const tests = db.getABTests({ teamId, status });
    
    // Enrich with variant info
    const enrichedTests = tests.map(test => {
      const variantA = db.getPromptKit(test.variant_a_id);
      const variantB = db.getPromptKit(test.variant_b_id);
      const results = db.getABTestResults(test.id);
      
      return {
        ...test,
        variantA: variantA ? { id: variantA.id, name: variantA.name } : null,
        variantB: variantB ? { id: variantB.id, name: variantB.name } : null,
        totalSamples: results.reduce((sum, r) => sum + r.total, 0)
      };
    });
    
    res.json(enrichedTests);
  } catch (error) {
    console.error('Get A/B tests error:', error);
    res.status(500).json({ error: 'Failed to get A/B tests' });
  }
});

// Get single A/B test with full details
router.get('/:id', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    const variantA = db.getPromptKit(test.variant_a_id);
    const variantB = db.getPromptKit(test.variant_b_id);
    const results = db.getABTestResults(test.id);
    const statistics = db.calculateABTestStatistics(test.id);
    
    res.json({
      ...test,
      variantA,
      variantB,
      results,
      statistics
    });
  } catch (error) {
    console.error('Get A/B test error:', error);
    res.status(500).json({ error: 'Failed to get A/B test' });
  }
});

// Start A/B test
router.post('/:id/start', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    if (test.status !== 'draft') {
      return res.status(400).json({ error: 'Test can only be started from draft status' });
    }
    
    db.startABTest(req.params.id);
    
    // Log activity
    const { startedBy } = req.body;
    if (test.team_id && startedBy) {
      db.logActivity(startedBy, test.team_id, 'started', 'ab_test', test.id, { name: test.name });
    }
    
    res.json({ success: true, status: 'running' });
  } catch (error) {
    console.error('Start A/B test error:', error);
    res.status(500).json({ error: 'Failed to start A/B test' });
  }
});

// End A/B test
router.post('/:id/end', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    if (test.status !== 'running') {
      return res.status(400).json({ error: 'Test can only be ended from running status' });
    }
    
    // Calculate winner
    const statistics = db.calculateABTestStatistics(req.params.id);
    const winner = statistics?.recommendedWinner || null;
    
    db.endABTest(req.params.id, winner);
    
    // Log activity
    const { endedBy } = req.body;
    if (test.team_id && endedBy) {
      db.logActivity(endedBy, test.team_id, 'ended', 'ab_test', test.id, { name: test.name, winner });
    }
    
    res.json({ success: true, status: 'completed', winner, statistics });
  } catch (error) {
    console.error('End A/B test error:', error);
    res.status(500).json({ error: 'Failed to end A/B test' });
  }
});

// Record A/B test result
router.post('/:id/results', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    if (test.status !== 'running') {
      return res.status(400).json({ error: 'Can only record results for running tests' });
    }
    
    const { variant, experimentId, success, latencyMs, userRating } = req.body;
    
    if (!variant || !['A', 'B'].includes(variant)) {
      return res.status(400).json({ error: 'Valid variant (A or B) is required' });
    }
    
    db.recordABTestResult(req.params.id, variant, {
      experimentId,
      success,
      latencyMs,
      userRating
    });
    
    // Check if we should auto-end the test
    const results = db.getABTestResults(req.params.id);
    const totalSamples = results.reduce((sum, r) => sum + r.total, 0);
    
    if (totalSamples >= test.min_samples) {
      const statistics = db.calculateABTestStatistics(req.params.id);
      
      // Auto-end if statistically significant
      if (statistics?.isSignificant) {
        db.endABTest(req.params.id, statistics.recommendedWinner);
        return res.json({
          success: true,
          autoEnded: true,
          winner: statistics.recommendedWinner,
          statistics
        });
      }
    }
    
    res.json({ success: true, totalSamples });
  } catch (error) {
    console.error('Record A/B result error:', error);
    res.status(500).json({ error: 'Failed to record A/B test result' });
  }
});

// Get A/B test statistics
router.get('/:id/statistics', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    const statistics = db.calculateABTestStatistics(req.params.id);
    res.json(statistics || { message: 'Not enough data to calculate statistics' });
  } catch (error) {
    console.error('Get A/B statistics error:', error);
    res.status(500).json({ error: 'Failed to get A/B test statistics' });
  }
});

// Get variant assignment for a user/session
router.get('/:id/assign', (req, res) => {
  try {
    const test = db.getABTest(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    if (test.status !== 'running') {
      return res.status(400).json({ error: 'Test is not running' });
    }
    
    // Simple random assignment based on traffic split
    const random = Math.random();
    const variant = random < test.traffic_split ? 'A' : 'B';
    const promptKit = variant === 'A' 
      ? db.getPromptKit(test.variant_a_id)
      : db.getPromptKit(test.variant_b_id);
    
    res.json({
      variant,
      promptKit,
      testId: test.id,
      testName: test.name
    });
  } catch (error) {
    console.error('Assign variant error:', error);
    res.status(500).json({ error: 'Failed to assign variant' });
  }
});

module.exports = router;
