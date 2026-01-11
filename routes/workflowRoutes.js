const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// Prompt Kit Routes
// ==========================================

// Create prompt kit
router.post('/kits', (req, res) => {
  try {
    const { name, description, prompt, models, createdBy, teamId } = req.body;
    
    if (!name || !prompt) {
      return res.status(400).json({ error: 'Name and prompt are required' });
    }
    
    const kit = db.createPromptKit({
      name,
      description,
      prompt,
      models: models || [],
      createdBy,
      teamId
    });
    
    // Log activity
    if (teamId && createdBy) {
      db.logActivity(createdBy, teamId, 'created', 'prompt_kit', kit.id, { name });
    }
    
    res.json(kit);
  } catch (error) {
    console.error('Create kit error:', error);
    res.status(500).json({ error: 'Failed to create prompt kit' });
  }
});

// Get prompt kits
router.get('/kits', (req, res) => {
  try {
    const { teamId, stage, createdBy } = req.query;
    const kits = db.getPromptKits({ teamId, stage, createdBy });
    res.json(kits);
  } catch (error) {
    console.error('Get kits error:', error);
    res.status(500).json({ error: 'Failed to get prompt kits' });
  }
});

// Get single prompt kit
router.get('/kits/:id', (req, res) => {
  try {
    const kit = db.getPromptKit(req.params.id);
    if (!kit) {
      return res.status(404).json({ error: 'Prompt kit not found' });
    }
    res.json(kit);
  } catch (error) {
    console.error('Get kit error:', error);
    res.status(500).json({ error: 'Failed to get prompt kit' });
  }
});

// Promote prompt kit
router.post('/kits/:id/promote', (req, res) => {
  try {
    const { toStage, deployedBy } = req.body;
    const kitId = req.params.id;
    
    const stageOrder = ['development', 'staging', 'production'];
    const kit = db.getPromptKit(kitId);
    
    if (!kit) {
      return res.status(404).json({ error: 'Prompt kit not found' });
    }
    
    const currentIndex = stageOrder.indexOf(kit.stage);
    const targetIndex = stageOrder.indexOf(toStage);
    
    if (targetIndex <= currentIndex) {
      return res.status(400).json({ error: 'Can only promote to a higher stage' });
    }
    
    const updatedKit = db.promotePromptKit(kitId, toStage, deployedBy);
    
    // Log activity
    if (kit.team_id && deployedBy) {
      db.logActivity(deployedBy, kit.team_id, 'promoted', 'prompt_kit', kitId, {
        name: kit.name,
        fromStage: kit.stage,
        toStage
      });
    }
    
    res.json(updatedKit);
  } catch (error) {
    console.error('Promote kit error:', error);
    res.status(500).json({ error: 'Failed to promote prompt kit' });
  }
});

// Rollback prompt kit
router.post('/kits/:id/rollback', (req, res) => {
  try {
    const { toVersion, rolledBackBy } = req.body;
    const kitId = req.params.id;
    
    const kit = db.getPromptKit(kitId);
    if (!kit) {
      return res.status(404).json({ error: 'Prompt kit not found' });
    }
    
    const updatedKit = db.rollbackPromptKit(kitId, toVersion);
    
    if (!updatedKit) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // Log activity
    if (kit.team_id && rolledBackBy) {
      db.logActivity(rolledBackBy, kit.team_id, 'rolled_back', 'prompt_kit', kitId, {
        name: kit.name,
        toVersion
      });
    }
    
    res.json(updatedKit);
  } catch (error) {
    console.error('Rollback kit error:', error);
    res.status(500).json({ error: 'Failed to rollback prompt kit' });
  }
});

// ==========================================
// Deployment Routes
// ==========================================

// Get deployments
router.get('/deployments', (req, res) => {
  try {
    const { teamId, limit } = req.query;
    
    let query = `
      SELECT d.*, pk.name as kit_name, u.name as deployed_by_name
      FROM deployments d
      LEFT JOIN prompt_kits pk ON d.kit_id = pk.id
      LEFT JOIN users u ON d.deployed_by = u.id
    `;
    
    const params = [];
    if (teamId) {
      query += ' WHERE pk.team_id = ?';
      params.push(teamId);
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const deployments = db.db.prepare(query).all(...params);
    res.json(deployments);
  } catch (error) {
    console.error('Get deployments error:', error);
    res.status(500).json({ error: 'Failed to get deployments' });
  }
});

// Get workflow stats
router.get('/stats', (req, res) => {
  try {
    const { teamId } = req.query;
    
    let whereClause = teamId ? 'WHERE team_id = ?' : '';
    const params = teamId ? [teamId] : [];
    
    const stats = {
      development: {
        experiments: db.db.prepare(`SELECT COUNT(*) as count FROM prompt_kits ${whereClause} AND stage = 'development'`).get(...params, 'development')?.count || 0,
        pendingReview: 0
      },
      staging: {
        inTesting: db.db.prepare(`SELECT COUNT(*) as count FROM prompt_kits ${whereClause ? whereClause + ' AND' : 'WHERE'} stage = 'staging'`).get(...params)?.count || 0,
        readyForProd: 0
      },
      production: {
        activePrompts: db.db.prepare(`SELECT COUNT(*) as count FROM prompt_kits ${whereClause ? whereClause + ' AND' : 'WHERE'} stage = 'production'`).get(...params)?.count || 0,
        uptime: 99.2
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get workflow stats error:', error);
    res.status(500).json({ error: 'Failed to get workflow stats' });
  }
});

module.exports = router;
