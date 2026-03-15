const express = require('express');
const { modelCategories, getPublicModels } = require('../services/modelCatalog');

const router = express.Router();

router.get('/', (req, res) => {
  const category = req.query.category;
  const publicModels = getPublicModels();

  if (category && modelCategories[category]) {
    const filteredModels = publicModels.filter((model) => modelCategories[category].includes(model.id));
    return res.json({ models: filteredModels, category });
  }

  return res.json({ models: publicModels, categories: Object.keys(modelCategories) });
});

router.get('/:id', (req, res) => {
  const model = getPublicModels().find((entry) => entry.id === req.params.id);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  return res.json(model);
});

module.exports = router;
