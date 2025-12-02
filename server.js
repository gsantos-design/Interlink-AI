const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chatRoutes');
const billingRoutes = require('./routes/billingRoutes');
const contestRoutes = require('./routes/contestRoutes');
const modelsRoutes = require('./routes/modelsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/chat', chatRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Interlink AI server running on port ${PORT}`);
});
