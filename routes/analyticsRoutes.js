const express = require('express');
const router = express.Router();
const db = require('../db/database');

const trackedModels = [
  'openai',
  'anthropic',
  'gemini',
  'llama',
  'kimi',
  'gptoss120b',
  'gptoss20b',
  'compound',
  'grok',
];

// Get analytics summary
router.get('/summary', (req, res) => {
  try {
    const { userId, teamId, since } = req.query;
    
    const experiments = db.getExperiments({ userId, teamId, since });
    const metrics = db.getAggregatedMetrics(since);
    
    const totalExperiments = experiments.length;
    const successfulExperiments = experiments.filter(e => e.success_rate >= 70).length;
    const avgLatency = experiments.length > 0 
      ? Math.round(experiments.reduce((sum, e) => sum + (e.avg_latency || 0), 0) / experiments.length)
      : 0;
    const modelsUsed = new Set(experiments.flatMap(e => e.models)).size;
    
    res.json({
      totalExperiments,
      successRate: totalExperiments > 0 ? Math.round((successfulExperiments / totalExperiments) * 100) : 0,
      avgLatency,
      modelsUsed,
      modelPerformance: metrics,
      recentExperiments: experiments.slice(0, 10)
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to get analytics summary' });
  }
});

// Record experiment
router.post('/experiments', (req, res) => {
  try {
    const { userId, teamId, title, prompt, models, results, avgLatency, successRate } = req.body;
    
    const experiment = db.createExperiment({
      userId,
      teamId,
      title: title || prompt?.substring(0, 50) + '...',
      prompt,
      models,
      results,
      avgLatency,
      successRate
    });
    
    // Record individual model metrics
    if (results && Array.isArray(results)) {
      results.forEach(result => {
        db.recordModelMetric({
          modelId: result.model || result.id,
          experimentId: experiment.id,
          latencyMs: result.latency || result.latencyMs,
          success: result.success !== false && result.text && !result.error,
          tokensUsed: result.tokens || 0,
          cost: result.cost || 0
        });
      });
    }
    
    // Log activity if team
    if (teamId && userId) {
      db.logActivity(userId, teamId, 'created', 'experiment', experiment.id, { title: experiment.title });
    }
    
    res.json(experiment);
  } catch (error) {
    console.error('Create experiment error:', error);
    res.status(500).json({ error: 'Failed to create experiment' });
  }
});

// Get experiments
router.get('/experiments', (req, res) => {
  try {
    const { userId, teamId, since, limit } = req.query;
    const experiments = db.getExperiments({ userId, teamId, since, limit: parseInt(limit) || 100 });
    res.json(experiments);
  } catch (error) {
    console.error('Get experiments error:', error);
    res.status(500).json({ error: 'Failed to get experiments' });
  }
});

// Get time-series data for a model
router.get('/models/:modelId/timeseries', (req, res) => {
  try {
    const { modelId } = req.params;
    const { interval, limit } = req.query;
    
    const data = db.getModelPerformanceTimeSeries(
      modelId, 
      interval || 'hour', 
      parseInt(limit) || 24
    );
    
    res.json(data);
  } catch (error) {
    console.error('Time series error:', error);
    res.status(500).json({ error: 'Failed to get time series data' });
  }
});

// Get all models time-series
router.get('/timeseries', (req, res) => {
  try {
    const { interval, limit } = req.query;
    const data = {};
    trackedModels.forEach(modelId => {
      data[modelId] = db.getModelPerformanceTimeSeries(
        modelId,
        interval || 'hour',
        parseInt(limit) || 24
      );
    });
    
    res.json(data);
  } catch (error) {
    console.error('All time series error:', error);
    res.status(500).json({ error: 'Failed to get time series data' });
  }
});

// Export analytics data
router.get('/export', (req, res) => {
  try {
    const { userId, teamId, since, format } = req.query;
    
    const experiments = db.getExperiments({ userId, teamId, since });
    const metrics = db.getAggregatedMetrics(since);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalExperiments: experiments.length,
        successRate: experiments.length > 0 
          ? Math.round((experiments.filter(e => e.success_rate >= 70).length / experiments.length) * 100)
          : 0,
        modelsUsed: new Set(experiments.flatMap(e => e.models)).size
      },
      modelPerformance: metrics,
      experiments
    };
    
    if (format === 'csv') {
      // Convert to CSV
      const headers = ['id', 'title', 'prompt', 'models', 'avg_latency', 'success_rate', 'created_at'];
      const rows = experiments.map(e => 
        headers.map(h => {
          const val = e[h];
          if (Array.isArray(val)) return `"${val.join(', ')}"`;
          if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
          return val;
        }).join(',')
      );
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=interlink-analytics.csv');
      res.send([headers.join(','), ...rows].join('\n'));
    } else {
      res.json(exportData);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export analytics' });
  }
});

module.exports = router;
