const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==========================================
// User Routes
// ==========================================

// Create or get user
router.post('/users', (req, res) => {
  try {
    const { name, email, avatarUrl } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const user = db.getOrCreateUser(name, email);
    res.json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
router.get('/users/:id', (req, res) => {
  try {
    const user = db.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ==========================================
// Team Routes
// ==========================================

// Create team
router.post('/teams', (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    
    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Name and createdBy are required' });
    }
    
    const team = db.createTeam(name, description, createdBy);
    
    // Log activity
    db.logActivity(createdBy, team.id, 'created', 'team', team.id, { name });
    
    res.json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Get team
router.get('/teams/:id', (req, res) => {
  try {
    const team = db.getTeam(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const members = db.getTeamMembers(req.params.id);
    res.json({ ...team, members });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
});

// Add team member
router.post('/teams/:id/members', (req, res) => {
  try {
    const { userId, role, addedBy } = req.body;
    const teamId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    db.addTeamMember(teamId, userId, role || 'member');
    
    // Log activity
    if (addedBy) {
      const user = db.getUser(userId);
      db.logActivity(addedBy, teamId, 'added_member', 'user', userId, { memberName: user?.name });
    }
    
    const members = db.getTeamMembers(teamId);
    res.json({ success: true, members });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// Get team members
router.get('/teams/:id/members', (req, res) => {
  try {
    const members = db.getTeamMembers(req.params.id);
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get team members' });
  }
});

// ==========================================
// Activity Feed Routes
// ==========================================

// Get activity feed
router.get('/teams/:id/activity', (req, res) => {
  try {
    const { limit } = req.query;
    const activities = db.getActivityFeed(req.params.id, parseInt(limit) || 50);
    res.json(activities);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity feed' });
  }
});

// Log activity (for external events)
router.post('/teams/:id/activity', (req, res) => {
  try {
    const { userId, action, entityType, entityId, details } = req.body;
    const teamId = req.params.id;
    
    db.logActivity(userId, teamId, action, entityType, entityId, details);
    res.json({ success: true });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

module.exports = router;
