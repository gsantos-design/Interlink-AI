const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// Pipeline Routes
// ==========================================

// Create pipeline
router.post('/', (req, res) => {
  try {
    const { name, description, kitId, config, createdBy, teamId } = req.body;
    
    if (!name || !kitId) {
      return res.status(400).json({ error: 'Name and kitId are required' });
    }
    
    // Verify kit exists
    const kit = db.getPromptKit(kitId);
    if (!kit) {
      return res.status(404).json({ error: 'Prompt kit not found' });
    }
    
    const pipeline = db.createPipeline({
      name,
      description,
      kitId,
      config: config || {
        stages: [
          { name: 'lint', enabled: true, timeout: 60 },
          { name: 'test', enabled: true, timeout: 300, minSuccessRate: 80 },
          { name: 'benchmark', enabled: true, timeout: 600, models: ['openai', 'anthropic', 'gemini'] },
          { name: 'deploy', enabled: true, targetStage: 'staging' }
        ],
        triggers: {
          onPush: false,
          onSchedule: null,
          manual: true
        },
        notifications: {
          onSuccess: true,
          onFailure: true,
          channels: []
        }
      },
      createdBy,
      teamId
    });
    
    // Log activity
    if (teamId && createdBy) {
      db.logActivity(createdBy, teamId, 'created', 'pipeline', pipeline.id, { name });
    }
    
    res.json(pipeline);
  } catch (error) {
    console.error('Create pipeline error:', error);
    res.status(500).json({ error: 'Failed to create pipeline' });
  }
});

// Get all pipelines
router.get('/', (req, res) => {
  try {
    const { teamId } = req.query;
    const pipelines = db.getPipelines({ teamId });
    
    // Enrich with kit info and last run
    const enrichedPipelines = pipelines.map(pipeline => {
      const kit = db.getPromptKit(pipeline.kit_id);
      const lastRun = db.db.prepare(`
        SELECT * FROM pipeline_runs WHERE pipeline_id = ? ORDER BY started_at DESC LIMIT 1
      `).get(pipeline.id);
      
      return {
        ...pipeline,
        kit: kit ? { id: kit.id, name: kit.name, stage: kit.stage } : null,
        lastRun: lastRun ? {
          id: lastRun.id,
          status: lastRun.status,
          startedAt: lastRun.started_at,
          completedAt: lastRun.completed_at
        } : null
      };
    });
    
    res.json(enrichedPipelines);
  } catch (error) {
    console.error('Get pipelines error:', error);
    res.status(500).json({ error: 'Failed to get pipelines' });
  }
});

// Get single pipeline
router.get('/:id', (req, res) => {
  try {
    const pipeline = db.getPipeline(req.params.id);
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    const kit = db.getPromptKit(pipeline.kit_id);
    const runs = db.db.prepare(`
      SELECT * FROM pipeline_runs WHERE pipeline_id = ? ORDER BY started_at DESC LIMIT 10
    `).all(req.params.id);
    
    res.json({
      ...pipeline,
      kit,
      runs: runs.map(r => ({
        ...r,
        stages: JSON.parse(r.stages)
      }))
    });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ error: 'Failed to get pipeline' });
  }
});

// Start pipeline run
router.post('/:id/run', async (req, res) => {
  try {
    const pipeline = db.getPipeline(req.params.id);
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    if (pipeline.status === 'running') {
      return res.status(400).json({ error: 'Pipeline is already running' });
    }
    
    const run = db.startPipelineRun(req.params.id);
    
    // Log activity
    const { triggeredBy } = req.body;
    const kit = db.getPromptKit(pipeline.kit_id);
    if (kit?.team_id && triggeredBy) {
      db.logActivity(triggeredBy, kit.team_id, 'started', 'pipeline_run', run.id, {
        pipelineName: pipeline.name
      });
    }
    
    // Simulate pipeline execution asynchronously
    simulatePipelineRun(run.id, pipeline, kit);
    
    res.json(run);
  } catch (error) {
    console.error('Start pipeline run error:', error);
    res.status(500).json({ error: 'Failed to start pipeline run' });
  }
});

// Get pipeline run details
router.get('/:id/runs/:runId', (req, res) => {
  try {
    const run = db.db.prepare('SELECT * FROM pipeline_runs WHERE id = ?').get(req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Pipeline run not found' });
    }
    
    res.json({
      ...run,
      stages: JSON.parse(run.stages)
    });
  } catch (error) {
    console.error('Get pipeline run error:', error);
    res.status(500).json({ error: 'Failed to get pipeline run' });
  }
});

// Cancel pipeline run
router.post('/:id/runs/:runId/cancel', (req, res) => {
  try {
    const run = db.db.prepare('SELECT * FROM pipeline_runs WHERE id = ?').get(req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Pipeline run not found' });
    }
    
    if (run.status !== 'running') {
      return res.status(400).json({ error: 'Can only cancel running pipelines' });
    }
    
    db.updatePipelineRun(req.params.runId, {
      status: 'cancelled',
      completedAt: new Date().toISOString(),
      logs: 'Pipeline cancelled by user'
    });
    
    res.json({ success: true, status: 'cancelled' });
  } catch (error) {
    console.error('Cancel pipeline run error:', error);
    res.status(500).json({ error: 'Failed to cancel pipeline run' });
  }
});

// Update pipeline config
router.patch('/:id', (req, res) => {
  try {
    const pipeline = db.getPipeline(req.params.id);
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    const { name, description, config } = req.body;
    
    const updates = [];
    const params = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (config) {
      updates.push('config = ?');
      params.push(JSON.stringify(config));
    }
    
    if (updates.length > 0) {
      params.push(req.params.id);
      db.db.prepare(`UPDATE pipelines SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }
    
    res.json(db.getPipeline(req.params.id));
  } catch (error) {
    console.error('Update pipeline error:', error);
    res.status(500).json({ error: 'Failed to update pipeline' });
  }
});

// Simulate pipeline execution
async function simulatePipelineRun(runId, pipeline, kit) {
  const stages = [
    { name: 'lint', duration: 2000 },
    { name: 'test', duration: 5000 },
    { name: 'benchmark', duration: 8000 },
    { name: 'deploy', duration: 3000 }
  ];
  
  let currentStages = stages.map(s => ({ name: s.name, status: 'pending' }));
  let logs = `Pipeline started at ${new Date().toISOString()}\n`;
  
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    
    // Update stage to running
    currentStages[i].status = 'running';
    currentStages[i].startedAt = new Date().toISOString();
    logs += `\n[${stage.name}] Starting...\n`;
    
    db.updatePipelineRun(runId, {
      stages: currentStages,
      logs
    });
    
    // Simulate stage execution
    await new Promise(resolve => setTimeout(resolve, stage.duration));
    
    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      currentStages[i].status = 'success';
      currentStages[i].completedAt = new Date().toISOString();
      logs += `[${stage.name}] Completed successfully\n`;
      
      // Add stage-specific logs
      if (stage.name === 'lint') {
        logs += `  - Checked prompt syntax: OK\n`;
        logs += `  - Validated variables: OK\n`;
      } else if (stage.name === 'test') {
        logs += `  - Ran 5 test cases\n`;
        logs += `  - Success rate: 100%\n`;
      } else if (stage.name === 'benchmark') {
        logs += `  - Tested against 3 models\n`;
        logs += `  - Avg latency: ${Math.round(1000 + Math.random() * 2000)}ms\n`;
        logs += `  - Avg success rate: ${Math.round(75 + Math.random() * 20)}%\n`;
      } else if (stage.name === 'deploy') {
        logs += `  - Promoted to staging\n`;
        logs += `  - Version: ${kit?.version || '1.0.0'}\n`;
      }
    } else {
      currentStages[i].status = 'failed';
      currentStages[i].completedAt = new Date().toISOString();
      currentStages[i].error = `${stage.name} failed: Simulated error`;
      logs += `[${stage.name}] FAILED: Simulated error\n`;
      
      // Mark remaining stages as skipped
      for (let j = i + 1; j < stages.length; j++) {
        currentStages[j].status = 'skipped';
      }
      
      db.updatePipelineRun(runId, {
        status: 'failed',
        stages: currentStages,
        logs,
        completedAt: new Date().toISOString()
      });
      
      return;
    }
    
    db.updatePipelineRun(runId, {
      stages: currentStages,
      logs
    });
  }
  
  // All stages completed successfully
  logs += `\nPipeline completed successfully at ${new Date().toISOString()}\n`;
  
  db.updatePipelineRun(runId, {
    status: 'completed',
    stages: currentStages,
    logs,
    completedAt: new Date().toISOString()
  });
  
  // Auto-promote kit if configured
  if (pipeline.config?.stages?.find(s => s.name === 'deploy')?.enabled && kit) {
    const targetStage = pipeline.config.stages.find(s => s.name === 'deploy')?.targetStage || 'staging';
    if (kit.stage !== targetStage && kit.stage !== 'production') {
      db.promotePromptKit(kit.id, targetStage, null);
    }
  }
}

module.exports = router;
