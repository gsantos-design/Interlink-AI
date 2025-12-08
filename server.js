require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

// Route modules
const chatRoutes = require('./routes/chatRoutes');
const contestRoutes = require('./routes/contestRoutes');
const modelsRoutes = require('./routes/modelsRoutes');
const billingRoutes = require('./routes/billingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

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

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback to SPA/landing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Interlink AI server running on port ${PORT}`);
});
