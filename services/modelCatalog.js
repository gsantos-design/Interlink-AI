const modelCatalog = [
  {
    id: 'openai',
    label: 'ChatGPT (OpenAI)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/><rect x="8" y="4" width="8" height="2" rx="1"/></svg>',
    color: '#10a37f',
    personality: 'Confident & Knowledgeable',
    tagClass: 'tag-openai',
    provider: 'OpenAI',
    version: 'GPT-4o',
    envVar: 'OPENAI_API_KEY',
  },
  {
    id: 'anthropic',
    label: 'Claude (Anthropic)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-4.4-1-7.5-4.7-7.5-8.5V8.3l7.5-3.8 7.5 3.8v3.2c0 3.8-3.1 7.5-7.5 8.5z"/><circle cx="12" cy="12" r="3"/></svg>',
    color: '#6B4FBB',
    personality: 'Thoughtful & Precise',
    tagClass: 'tag-claude',
    provider: 'Anthropic',
    version: 'Claude 3 Haiku',
    envVar: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'gemini',
    label: 'Gemini (Google)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>',
    color: '#4285f4',
    personality: 'Creative & Unpredictable',
    tagClass: 'tag-gemini',
    provider: 'Google',
    version: 'Gemini 2.0 Flash',
    envVar: 'GEMINI_API_KEY',
  },
  {
    id: 'llama',
    label: 'Llama 3.3 70B (Groq)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="10" rx="8" ry="6"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5"/><rect x="10" y="2" width="4" height="4" rx="2"/></svg>',
    color: '#0084ff',
    personality: 'Fast & Balanced',
    tagClass: 'tag-llama',
    provider: 'Meta/Groq',
    version: 'Llama 3.3 70B',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'kimi',
    label: 'Kimi-K2 (Groq)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/><path d="M10 10l2 2 4-4" stroke="#02030a" stroke-width="1.5" fill="none"/></svg>',
    color: '#ff6b35',
    personality: 'Agentic Reasoning Expert',
    tagClass: 'tag-kimi',
    provider: 'Moonshot/Groq',
    version: 'Kimi-K2',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'gptoss120b',
    label: 'GPT-OSS 120B (Groq)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
    color: '#8b5cf6',
    personality: 'High-Capability Reasoning',
    tagClass: 'tag-gptoss120b',
    provider: 'Groq',
    version: 'GPT-OSS 120B',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'gptoss20b',
    label: 'GPT-OSS 20B (Groq)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="5" height="5" rx="1"/><rect x="13" y="6" width="5" height="5" rx="1"/><rect x="6" y="13" width="5" height="5" rx="1"/><rect x="13" y="13" width="5" height="5" rx="1"/></svg>',
    color: '#06b6d4',
    personality: 'Compact & Efficient',
    tagClass: 'tag-gptoss20b',
    provider: 'Groq',
    version: 'GPT-OSS 20B',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'compound',
    label: 'Compound Beta (Groq)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="12" y1="9" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>',
    color: '#ec4899',
    personality: 'Multi-Model Orchestrator',
    tagClass: 'tag-compound',
    provider: 'Groq',
    version: 'Compound Beta',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'grok',
    label: 'Grok (xAI)',
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 8l8 8M16 8l-8 8" stroke="#02030a" stroke-width="1.5" fill="none"/></svg>',
    color: '#f97316',
    personality: 'Fast & Opinionated',
    tagClass: 'tag-grok',
    provider: 'xAI',
    version: 'Grok Beta',
    envVar: 'XAI_API_KEY',
  },
];

const modelCategories = {
  frontier: ['openai', 'anthropic', 'gemini'],
  'groq-hosted': ['llama', 'kimi', 'gptoss120b', 'gptoss20b'],
  enterprise: ['openai', 'anthropic', 'gemini'],
  fast: ['grok', 'gptoss20b', 'llama'],
  reasoning: ['anthropic', 'kimi', 'gptoss120b', 'compound'],
};

function isConfigured(model) {
  return !model.envVar || Boolean(process.env[model.envVar]);
}

function toPublicModel(model) {
  return {
    id: model.id,
    label: model.label,
    avatar: model.avatar,
    color: model.color,
    personality: model.personality,
    tagClass: model.tagClass,
    provider: model.provider,
    version: model.version,
  };
}

function getAvailableModels() {
  return modelCatalog.filter(isConfigured);
}

function getPublicModels() {
  return getAvailableModels().map(toPublicModel);
}

function getReviewModelForUpdate(model) {
  if (model.id === 'openai') {
    return process.env.OPENAI_CODE_REVIEW_MODEL || null;
  }

  if (model.id === 'anthropic') {
    return process.env.ANTHROPIC_CODE_REVIEW_MODEL || null;
  }

  return null;
}

function getModelUpdates() {
  return modelCatalog.map((model) => ({
    id: model.id,
    label: model.label,
    provider: model.provider,
    version: model.version,
    reviewModel: getReviewModelForUpdate(model),
    status: isConfigured(model) ? 'configured' : 'missing_key',
    configured: isConfigured(model),
    lastVerifiedAt: null,
  }));
}

module.exports = {
  modelCatalog,
  modelCategories,
  getAvailableModels,
  getPublicModels,
  getModelUpdates,
  toPublicModel,
};
