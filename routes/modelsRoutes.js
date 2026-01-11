const express = require('express');

const router = express.Router();

const models = [
  { 
    id: 'openai', 
    label: 'ChatGPT (OpenAI)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/><rect x="8" y="4" width="8" height="2" rx="1"/></svg>', 
    color: '#10a37f',
    personality: 'Confident & Knowledgeable',
    tagClass: 'tag-openai',
    provider: 'OpenAI',
    version: 'GPT-4o'
  },
  { 
    id: 'anthropic', 
    label: 'Claude (Anthropic)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-4.4-1-7.5-4.7-7.5-8.5V8.3l7.5-3.8 7.5 3.8v3.2c0 3.8-3.1 7.5-7.5 8.5z"/><circle cx="12" cy="12" r="3"/></svg>', 
    color: '#6B4FBB',
    personality: 'Thoughtful & Precise',
    tagClass: 'tag-claude',
    provider: 'Anthropic',
    version: 'Claude 3.5 Sonnet'
  },
  { 
    id: 'gemini', 
    label: 'Gemini (Google)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>', 
    color: '#4285f4',
    personality: 'Creative & Unpredictable',
    tagClass: 'tag-gemini',
    provider: 'Google',
    version: 'Gemini 2.0 Flash'
  },
  { 
    id: 'llama', 
    label: 'Llama 3.3 70B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="10" rx="8" ry="6"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5"/><rect x="10" y="2" width="4" height="4" rx="2"/></svg>', 
    color: '#0084ff',
    personality: 'Fast & Balanced',
    tagClass: 'tag-llama',
    provider: 'Meta/Groq',
    version: 'Llama 3.3 70B'
  },
  { 
    id: 'mistral', 
    label: 'Mistral Large (Mistral AI)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.5L18 8v8l-6 3-6-3V8l6-3.5z"/><circle cx="12" cy="12" r="3"/></svg>', 
    color: '#ff7000',
    personality: 'Efficient & Multilingual',
    tagClass: 'tag-mistral',
    provider: 'Mistral AI',
    version: 'Mistral Large 2'
  },
  { 
    id: 'deepseek', 
    label: 'DeepSeek V3', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6" stroke="#02030a" stroke-width="2" fill="none"/></svg>', 
    color: '#00d4aa',
    personality: 'Deep Reasoning',
    tagClass: 'tag-deepseek',
    provider: 'DeepSeek',
    version: 'DeepSeek V3'
  },
  { 
    id: 'kimi', 
    label: 'Kimi-K2 (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/><path d="M10 10l2 2 4-4" stroke="#02030a" stroke-width="1.5" fill="none"/></svg>', 
    color: '#ff6b35',
    personality: 'Agentic Reasoning Expert',
    tagClass: 'tag-kimi',
    provider: 'Moonshot/Groq',
    version: 'Kimi-K2'
  },
  { 
    id: 'qwen', 
    label: 'Qwen 2.5 72B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="9" r="2"/><path d="M8 15c0 0 2 3 4 3s4-3 4-3"/></svg>', 
    color: '#7c3aed',
    personality: 'Multilingual Powerhouse',
    tagClass: 'tag-qwen',
    provider: 'Alibaba/Groq',
    version: 'Qwen 2.5 72B'
  },
  { 
    id: 'gptoss120b', 
    label: 'GPT-OSS 120B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>', 
    color: '#8b5cf6',
    personality: 'High-Capability Reasoning',
    tagClass: 'tag-gptoss120b',
    provider: 'Groq',
    version: 'GPT-OSS 120B'
  },
  { 
    id: 'gptoss20b', 
    label: 'GPT-OSS 20B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="5" height="5" rx="1"/><rect x="13" y="6" width="5" height="5" rx="1"/><rect x="6" y="13" width="5" height="5" rx="1"/><rect x="13" y="13" width="5" height="5" rx="1"/></svg>', 
    color: '#06b6d4',
    personality: 'Compact & Efficient',
    tagClass: 'tag-gptoss20b',
    provider: 'Groq',
    version: 'GPT-OSS 20B'
  },
  { 
    id: 'compound', 
    label: 'Compound Beta (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="12" y1="9" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>', 
    color: '#ec4899',
    personality: 'Multi-Model Orchestrator',
    tagClass: 'tag-compound',
    provider: 'Groq',
    version: 'Compound Beta'
  },
  { 
    id: 'cohere', 
    label: 'Command R+ (Cohere)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>', 
    color: '#d946ef',
    personality: 'Enterprise RAG Expert',
    tagClass: 'tag-cohere',
    provider: 'Cohere',
    version: 'Command R+'
  },
];

// Model categories for filtering
const modelCategories = {
  'frontier': ['openai', 'anthropic', 'gemini'],
  'open-source': ['llama', 'mistral', 'deepseek', 'qwen'],
  'groq-hosted': ['llama', 'kimi', 'gptoss120b', 'gptoss20b', 'compound', 'qwen'],
  'enterprise': ['openai', 'anthropic', 'cohere'],
  'fast': ['groq', 'gptoss20b', 'llama'],
  'reasoning': ['anthropic', 'deepseek', 'kimi', 'gptoss120b']
};

router.get('/', (req, res) => {
  const category = req.query.category;
  
  if (category && modelCategories[category]) {
    const filteredModels = models.filter(m => modelCategories[category].includes(m.id));
    res.json({ models: filteredModels, category });
  } else {
    res.json({ models, categories: Object.keys(modelCategories) });
  }
});

router.get('/:id', (req, res) => {
  const model = models.find(m => m.id === req.params.id);
  if (model) {
    res.json(model);
  } else {
    res.status(404).json({ error: 'Model not found' });
  }
});

module.exports = router;
