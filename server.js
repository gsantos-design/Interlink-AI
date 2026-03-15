require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Route modules
const chatRoutes = require('./routes/chatRoutes');
const contestRoutes = require('./routes/contestRoutes');
const modelsRoutes = require('./routes/modelsRoutes');
const billingRoutes = require('./routes/billingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const codeValidationRoutes = require('./routes/codeValidationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const abTestRoutes = require('./routes/abTestRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO for real-time collaboration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store active users per team
const teamUsers = new Map();
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join team room
  socket.on('join-team', ({ teamId, userId, userName }) => {
    socket.join(`team:${teamId}`);
    socket.teamId = teamId;
    socket.userId = userId;
    socket.userName = userName;
    
    // Track user
    if (!teamUsers.has(teamId)) {
      teamUsers.set(teamId, new Map());
    }
    teamUsers.get(teamId).set(userId, {
      id: userId,
      name: userName,
      socketId: socket.id,
      joinedAt: new Date()
    });
    userSockets.set(socket.id, { teamId, userId });
    
    // Broadcast user joined
    io.to(`team:${teamId}`).emit('user-joined', {
      userId,
      userName,
      activeUsers: Array.from(teamUsers.get(teamId).values())
    });
  });
  
  // Leave team room
  socket.on('leave-team', ({ teamId, userId }) => {
    socket.leave(`team:${teamId}`);
    
    if (teamUsers.has(teamId)) {
      teamUsers.get(teamId).delete(userId);
      
      io.to(`team:${teamId}`).emit('user-left', {
        userId,
        activeUsers: Array.from(teamUsers.get(teamId).values())
      });
    }
  });
  
  // Broadcast experiment started
  socket.on('experiment-started', ({ teamId, userId, userName, experimentData }) => {
    socket.to(`team:${teamId}`).emit('experiment-started', {
      userId,
      userName,
      experimentData,
      timestamp: new Date()
    });
  });
  
  // Broadcast experiment completed
  socket.on('experiment-completed', ({ teamId, userId, userName, experimentData, results }) => {
    socket.to(`team:${teamId}`).emit('experiment-completed', {
      userId,
      userName,
      experimentData,
      results,
      timestamp: new Date()
    });
  });
  
  // Broadcast prompt kit update
  socket.on('kit-updated', ({ teamId, userId, userName, kitId, action, details }) => {
    socket.to(`team:${teamId}`).emit('kit-updated', {
      userId,
      userName,
      kitId,
      action,
      details,
      timestamp: new Date()
    });
  });
  
  // Broadcast A/B test update
  socket.on('ab-test-updated', ({ teamId, userId, userName, testId, action, details }) => {
    socket.to(`team:${teamId}`).emit('ab-test-updated', {
      userId,
      userName,
      testId,
      action,
      details,
      timestamp: new Date()
    });
  });
  
  // Broadcast pipeline update
  socket.on('pipeline-updated', ({ teamId, userId, userName, pipelineId, runId, status, stage }) => {
    socket.to(`team:${teamId}`).emit('pipeline-updated', {
      userId,
      userName,
      pipelineId,
      runId,
      status,
      stage,
      timestamp: new Date()
    });
  });
  
  // Real-time cursor/presence (for collaborative editing)
  socket.on('cursor-move', ({ teamId, userId, position, context }) => {
    socket.to(`team:${teamId}`).emit('cursor-move', {
      userId,
      position,
      context
    });
  });
  
  // Chat messages within team
  socket.on('team-message', ({ teamId, userId, userName, message }) => {
    io.to(`team:${teamId}`).emit('team-message', {
      userId,
      userName,
      message,
      timestamp: new Date()
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const userData = userSockets.get(socket.id);
    if (userData) {
      const { teamId, userId } = userData;
      
      if (teamUsers.has(teamId)) {
        teamUsers.get(teamId).delete(userId);
        
        io.to(`team:${teamId}`).emit('user-left', {
          userId,
          activeUsers: Array.from(teamUsers.get(teamId).values())
        });
      }
      
      userSockets.delete(socket.id);
    }
  });
});

// Make io available to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static frontend
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/validate/code', codeValidationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/ab-tests', abTestRoutes);
app.use('/api/pipelines', pipelineRoutes);

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback to SPA/landing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
server.listen(PORT, () => {
  console.log(`Interlink AI server running on port ${PORT}`);
  console.log(`Real-time collaboration enabled via Socket.IO`);
});

// Deploy trigger 2025-12-09 22:23:34
