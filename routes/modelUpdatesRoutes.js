const express = require('express');
const { getModelUpdates } = require('../services/modelCatalog');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    models: getModelUpdates(),
    updatedAt: new Date().toISOString(),
  });
});

module.exports = router;
