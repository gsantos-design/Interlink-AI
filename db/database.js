const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize database
const dbPath = path.join(__dirname, 'interlink.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table for collaboration
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Teams for collaboration
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Team members
  CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id)
  );

  -- Experiments/Analytics
  CREATE TABLE IF NOT EXISTS experiments (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    team_id TEXT REFERENCES teams(id),
    title TEXT,
    prompt TEXT NOT NULL,
    models TEXT NOT NULL,
    results TEXT,
    avg_latency REAL,
    success_rate REAL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Model performance metrics (time-series)
  CREATE TABLE IF NOT EXISTS model_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id TEXT NOT NULL,
    experiment_id TEXT REFERENCES experiments(id),
    latency_ms INTEGER,
    success INTEGER,
    tokens_used INTEGER,
    cost REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Prompt kits for workflow
  CREATE TABLE IF NOT EXISTS prompt_kits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    models TEXT,
    stage TEXT DEFAULT 'development',
    version TEXT DEFAULT '1.0.0',
    created_by TEXT REFERENCES users(id),
    team_id TEXT REFERENCES teams(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Prompt kit versions for rollback
  CREATE TABLE IF NOT EXISTS prompt_kit_versions (
    id TEXT PRIMARY KEY,
    kit_id TEXT REFERENCES prompt_kits(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    prompt TEXT NOT NULL,
    models TEXT,
    stage TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Deployments
  CREATE TABLE IF NOT EXISTS deployments (
    id TEXT PRIMARY KEY,
    kit_id TEXT REFERENCES prompt_kits(id),
    from_stage TEXT,
    to_stage TEXT,
    status TEXT DEFAULT 'success',
    deployed_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- A/B Tests
  CREATE TABLE IF NOT EXISTS ab_tests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    variant_a_id TEXT REFERENCES prompt_kits(id),
    variant_b_id TEXT REFERENCES prompt_kits(id),
    traffic_split REAL DEFAULT 0.5,
    metric_type TEXT DEFAULT 'success_rate',
    min_samples INTEGER DEFAULT 100,
    confidence_level REAL DEFAULT 0.95,
    winner TEXT,
    created_by TEXT REFERENCES users(id),
    team_id TEXT REFERENCES teams(id),
    started_at DATETIME,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- A/B Test results
  CREATE TABLE IF NOT EXISTS ab_test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id TEXT REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant TEXT NOT NULL,
    experiment_id TEXT REFERENCES experiments(id),
    success INTEGER,
    latency_ms INTEGER,
    user_rating INTEGER,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- CI/CD Pipelines
  CREATE TABLE IF NOT EXISTS pipelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    kit_id TEXT REFERENCES prompt_kits(id),
    config TEXT,
    status TEXT DEFAULT 'idle',
    last_run DATETIME,
    created_by TEXT REFERENCES users(id),
    team_id TEXT REFERENCES teams(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Pipeline runs
  CREATE TABLE IF NOT EXISTS pipeline_runs (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT REFERENCES pipelines(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'running',
    stages TEXT,
    logs TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
  );

  -- Collaboration activity feed
  CREATE TABLE IF NOT EXISTS activity_feed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(id),
    team_id TEXT REFERENCES teams(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_experiments_user ON experiments(user_id);
  CREATE INDEX IF NOT EXISTS idx_experiments_team ON experiments(team_id);
  CREATE INDEX IF NOT EXISTS idx_experiments_created ON experiments(created_at);
  CREATE INDEX IF NOT EXISTS idx_model_metrics_model ON model_metrics(model_id);
  CREATE INDEX IF NOT EXISTS idx_model_metrics_recorded ON model_metrics(recorded_at);
  CREATE INDEX IF NOT EXISTS idx_ab_test_results_test ON ab_test_results(test_id);
  CREATE INDEX IF NOT EXISTS idx_activity_feed_team ON activity_feed(team_id);
`);

// Helper functions
const generateId = () => uuidv4();

// User functions
const createUser = (name, email, avatarUrl = null) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, avatar_url) VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, name, email, avatarUrl);
  return { id, name, email, avatar_url: avatarUrl };
};

const getUser = (id) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

const getOrCreateUser = (name, email) => {
  let user = getUserByEmail(email);
  if (!user) {
    user = createUser(name, email);
  }
  return user;
};

// Team functions
const createTeam = (name, description, createdBy) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO teams (id, name, description, created_by) VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, name, description, createdBy);
  
  // Add creator as admin
  db.prepare(`
    INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'admin')
  `).run(id, createdBy);
  
  return { id, name, description, created_by: createdBy };
};

const getTeam = (id) => {
  return db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
};

const getTeamMembers = (teamId) => {
  return db.prepare(`
    SELECT u.*, tm.role, tm.joined_at 
    FROM users u 
    JOIN team_members tm ON u.id = tm.user_id 
    WHERE tm.team_id = ?
  `).all(teamId);
};

const addTeamMember = (teamId, userId, role = 'member') => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)
  `);
  stmt.run(teamId, userId, role);
};

// Experiment functions
const createExperiment = (data) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO experiments (id, user_id, team_id, title, prompt, models, results, avg_latency, success_rate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.userId,
    data.teamId || null,
    data.title,
    data.prompt,
    JSON.stringify(data.models),
    JSON.stringify(data.results),
    data.avgLatency,
    data.successRate,
    data.status || 'completed'
  );
  return { id, ...data };
};

const getExperiments = (filters = {}) => {
  let query = 'SELECT * FROM experiments WHERE 1=1';
  const params = [];
  
  if (filters.userId) {
    query += ' AND user_id = ?';
    params.push(filters.userId);
  }
  if (filters.teamId) {
    query += ' AND team_id = ?';
    params.push(filters.teamId);
  }
  if (filters.since) {
    query += ' AND created_at >= ?';
    params.push(filters.since);
  }
  
  query += ' ORDER BY created_at DESC';
  
  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }
  
  const results = db.prepare(query).all(...params);
  return results.map(r => ({
    ...r,
    models: JSON.parse(r.models),
    results: r.results ? JSON.parse(r.results) : null
  }));
};

// Model metrics functions
const recordModelMetric = (data) => {
  const stmt = db.prepare(`
    INSERT INTO model_metrics (model_id, experiment_id, latency_ms, success, tokens_used, cost)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.modelId,
    data.experimentId,
    data.latencyMs,
    data.success ? 1 : 0,
    data.tokensUsed || 0,
    data.cost || 0
  );
};

const getModelMetrics = (modelId, since = null, until = null) => {
  let query = 'SELECT * FROM model_metrics WHERE model_id = ?';
  const params = [modelId];
  
  if (since) {
    query += ' AND recorded_at >= ?';
    params.push(since);
  }
  if (until) {
    query += ' AND recorded_at <= ?';
    params.push(until);
  }
  
  query += ' ORDER BY recorded_at ASC';
  return db.prepare(query).all(...params);
};

const getModelPerformanceTimeSeries = (modelId, interval = 'hour', limit = 24) => {
  const intervalMap = {
    'hour': '%Y-%m-%d %H:00:00',
    'day': '%Y-%m-%d',
    'week': '%Y-%W',
    'month': '%Y-%m'
  };
  
  const format = intervalMap[interval] || intervalMap['hour'];
  
  const query = `
    SELECT 
      strftime('${format}', recorded_at) as period,
      AVG(latency_ms) as avg_latency,
      SUM(success) * 100.0 / COUNT(*) as success_rate,
      COUNT(*) as total_requests,
      SUM(tokens_used) as total_tokens
    FROM model_metrics 
    WHERE model_id = ?
    GROUP BY period
    ORDER BY period DESC
    LIMIT ?
  `;
  
  return db.prepare(query).all(modelId, limit).reverse();
};

const getAggregatedMetrics = (since = null) => {
  let query = `
    SELECT 
      model_id,
      AVG(latency_ms) as avg_latency,
      SUM(success) * 100.0 / COUNT(*) as success_rate,
      COUNT(*) as total_requests
    FROM model_metrics
  `;
  
  const params = [];
  if (since) {
    query += ' WHERE recorded_at >= ?';
    params.push(since);
  }
  
  query += ' GROUP BY model_id';
  return db.prepare(query).all(...params);
};

// Prompt kit functions
const createPromptKit = (data) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO prompt_kits (id, name, description, prompt, models, stage, created_by, team_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.name,
    data.description || '',
    data.prompt,
    JSON.stringify(data.models || []),
    data.stage || 'development',
    data.createdBy,
    data.teamId || null
  );
  
  // Create initial version
  createPromptKitVersion(id, '1.0.0', data.prompt, data.models, 'development');
  
  return { id, ...data };
};

const createPromptKitVersion = (kitId, version, prompt, models, stage) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO prompt_kit_versions (id, kit_id, version, prompt, models, stage)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, kitId, version, prompt, JSON.stringify(models || []), stage);
  return id;
};

const getPromptKit = (id) => {
  const kit = db.prepare('SELECT * FROM prompt_kits WHERE id = ?').get(id);
  if (kit) {
    kit.models = JSON.parse(kit.models);
  }
  return kit;
};

const getPromptKits = (filters = {}) => {
  let query = 'SELECT * FROM prompt_kits WHERE 1=1';
  const params = [];
  
  if (filters.teamId) {
    query += ' AND team_id = ?';
    params.push(filters.teamId);
  }
  if (filters.stage) {
    query += ' AND stage = ?';
    params.push(filters.stage);
  }
  if (filters.createdBy) {
    query += ' AND created_by = ?';
    params.push(filters.createdBy);
  }
  
  query += ' ORDER BY updated_at DESC';
  
  const results = db.prepare(query).all(...params);
  return results.map(r => ({ ...r, models: JSON.parse(r.models) }));
};

const promotePromptKit = (kitId, toStage, deployedBy) => {
  const kit = getPromptKit(kitId);
  if (!kit) return null;
  
  const fromStage = kit.stage;
  const newVersion = incrementVersion(kit.version);
  
  // Update kit
  db.prepare(`
    UPDATE prompt_kits SET stage = ?, version = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(toStage, newVersion, kitId);
  
  // Create version snapshot
  createPromptKitVersion(kitId, newVersion, kit.prompt, kit.models, toStage);
  
  // Record deployment
  const deploymentId = generateId();
  db.prepare(`
    INSERT INTO deployments (id, kit_id, from_stage, to_stage, deployed_by) VALUES (?, ?, ?, ?, ?)
  `).run(deploymentId, kitId, fromStage, toStage, deployedBy);
  
  return { ...kit, stage: toStage, version: newVersion };
};

const rollbackPromptKit = (kitId, toVersion) => {
  const version = db.prepare(`
    SELECT * FROM prompt_kit_versions WHERE kit_id = ? AND version = ?
  `).get(kitId, toVersion);
  
  if (!version) return null;
  
  db.prepare(`
    UPDATE prompt_kits SET prompt = ?, models = ?, stage = ?, version = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(version.prompt, version.models, version.stage, version.version, kitId);
  
  return getPromptKit(kitId);
};

// A/B Test functions
const createABTest = (data) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO ab_tests (id, name, description, variant_a_id, variant_b_id, traffic_split, metric_type, min_samples, confidence_level, created_by, team_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.name,
    data.description || '',
    data.variantAId,
    data.variantBId,
    data.trafficSplit || 0.5,
    data.metricType || 'success_rate',
    data.minSamples || 100,
    data.confidenceLevel || 0.95,
    data.createdBy,
    data.teamId || null
  );
  return { id, ...data, status: 'draft' };
};

const startABTest = (testId) => {
  db.prepare(`
    UPDATE ab_tests SET status = 'running', started_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(testId);
};

const endABTest = (testId, winner = null) => {
  db.prepare(`
    UPDATE ab_tests SET status = 'completed', winner = ?, ended_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(winner, testId);
};

const recordABTestResult = (testId, variant, data) => {
  const stmt = db.prepare(`
    INSERT INTO ab_test_results (test_id, variant, experiment_id, success, latency_ms, user_rating)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(testId, variant, data.experimentId, data.success ? 1 : 0, data.latencyMs, data.userRating || null);
};

const getABTest = (id) => {
  return db.prepare('SELECT * FROM ab_tests WHERE id = ?').get(id);
};

const getABTests = (filters = {}) => {
  let query = 'SELECT * FROM ab_tests WHERE 1=1';
  const params = [];
  
  if (filters.teamId) {
    query += ' AND team_id = ?';
    params.push(filters.teamId);
  }
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  query += ' ORDER BY created_at DESC';
  return db.prepare(query).all(...params);
};

const getABTestResults = (testId) => {
  const results = db.prepare(`
    SELECT 
      variant,
      COUNT(*) as total,
      SUM(success) as successes,
      AVG(latency_ms) as avg_latency,
      AVG(user_rating) as avg_rating
    FROM ab_test_results 
    WHERE test_id = ?
    GROUP BY variant
  `).all(testId);
  
  return results;
};

const calculateABTestStatistics = (testId) => {
  const results = getABTestResults(testId);
  if (results.length < 2) return null;
  
  const variantA = results.find(r => r.variant === 'A') || { total: 0, successes: 0 };
  const variantB = results.find(r => r.variant === 'B') || { total: 0, successes: 0 };
  
  const pA = variantA.successes / variantA.total || 0;
  const pB = variantB.successes / variantB.total || 0;
  
  // Calculate z-score for two-proportion z-test
  const pooledP = (variantA.successes + variantB.successes) / (variantA.total + variantB.total);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1/variantA.total + 1/variantB.total));
  const zScore = se > 0 ? (pB - pA) / se : 0;
  
  // Calculate p-value (two-tailed)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  // Calculate confidence interval
  const ci95 = 1.96 * se;
  
  return {
    variantA: {
      total: variantA.total,
      successes: variantA.successes,
      rate: pA,
      avgLatency: variantA.avg_latency,
      avgRating: variantA.avg_rating
    },
    variantB: {
      total: variantB.total,
      successes: variantB.successes,
      rate: pB,
      avgLatency: variantB.avg_latency,
      avgRating: variantB.avg_rating
    },
    difference: pB - pA,
    relativeImprovement: pA > 0 ? ((pB - pA) / pA) * 100 : 0,
    zScore,
    pValue,
    confidenceInterval: [pB - pA - ci95, pB - pA + ci95],
    isSignificant: pValue < 0.05,
    recommendedWinner: pValue < 0.05 ? (pB > pA ? 'B' : 'A') : null
  };
};

// Normal CDF approximation
function normalCDF(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

// Pipeline functions
const createPipeline = (data) => {
  const id = generateId();
  const stmt = db.prepare(`
    INSERT INTO pipelines (id, name, description, kit_id, config, created_by, team_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    data.name,
    data.description || '',
    data.kitId,
    JSON.stringify(data.config || {}),
    data.createdBy,
    data.teamId || null
  );
  return { id, ...data };
};

const getPipeline = (id) => {
  const pipeline = db.prepare('SELECT * FROM pipelines WHERE id = ?').get(id);
  if (pipeline) {
    pipeline.config = JSON.parse(pipeline.config);
  }
  return pipeline;
};

const getPipelines = (filters = {}) => {
  let query = 'SELECT * FROM pipelines WHERE 1=1';
  const params = [];
  
  if (filters.teamId) {
    query += ' AND team_id = ?';
    params.push(filters.teamId);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const results = db.prepare(query).all(...params);
  return results.map(r => ({ ...r, config: JSON.parse(r.config) }));
};

const startPipelineRun = (pipelineId) => {
  const id = generateId();
  const stages = JSON.stringify([
    { name: 'lint', status: 'pending' },
    { name: 'test', status: 'pending' },
    { name: 'benchmark', status: 'pending' },
    { name: 'deploy', status: 'pending' }
  ]);
  
  db.prepare(`
    INSERT INTO pipeline_runs (id, pipeline_id, stages) VALUES (?, ?, ?)
  `).run(id, pipelineId, stages);
  
  db.prepare(`
    UPDATE pipelines SET status = 'running', last_run = CURRENT_TIMESTAMP WHERE id = ?
  `).run(pipelineId);
  
  return { id, pipelineId, status: 'running', stages: JSON.parse(stages) };
};

const updatePipelineRun = (runId, updates) => {
  const run = db.prepare('SELECT * FROM pipeline_runs WHERE id = ?').get(runId);
  if (!run) return null;
  
  const stages = updates.stages ? JSON.stringify(updates.stages) : run.stages;
  const logs = updates.logs ? run.logs + '\n' + updates.logs : run.logs;
  
  db.prepare(`
    UPDATE pipeline_runs SET status = ?, stages = ?, logs = ?, completed_at = ? WHERE id = ?
  `).run(updates.status || run.status, stages, logs, updates.completedAt || null, runId);
  
  if (updates.status === 'completed' || updates.status === 'failed') {
    const pipelineId = run.pipeline_id;
    db.prepare(`
      UPDATE pipelines SET status = 'idle' WHERE id = ?
    `).run(pipelineId);
  }
  
  return { ...run, ...updates, stages: JSON.parse(stages) };
};

// Activity feed
const logActivity = (userId, teamId, action, entityType, entityId, details = null) => {
  db.prepare(`
    INSERT INTO activity_feed (user_id, team_id, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, teamId, action, entityType, entityId, details ? JSON.stringify(details) : null);
};

const getActivityFeed = (teamId, limit = 50) => {
  const activities = db.prepare(`
    SELECT af.*, u.name as user_name, u.avatar_url as user_avatar
    FROM activity_feed af
    LEFT JOIN users u ON af.user_id = u.id
    WHERE af.team_id = ?
    ORDER BY af.created_at DESC
    LIMIT ?
  `).all(teamId, limit);
  
  return activities.map(a => ({
    ...a,
    details: a.details ? JSON.parse(a.details) : null
  }));
};

// Helper function
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  parts[2] = (parts[2] || 0) + 1;
  if (parts[2] >= 10) {
    parts[2] = 0;
    parts[1] = (parts[1] || 0) + 1;
  }
  if (parts[1] >= 10) {
    parts[1] = 0;
    parts[0] = (parts[0] || 0) + 1;
  }
  return parts.join('.');
}

module.exports = {
  db,
  generateId,
  // Users
  createUser,
  getUser,
  getUserByEmail,
  getOrCreateUser,
  // Teams
  createTeam,
  getTeam,
  getTeamMembers,
  addTeamMember,
  // Experiments
  createExperiment,
  getExperiments,
  // Model metrics
  recordModelMetric,
  getModelMetrics,
  getModelPerformanceTimeSeries,
  getAggregatedMetrics,
  // Prompt kits
  createPromptKit,
  getPromptKit,
  getPromptKits,
  promotePromptKit,
  rollbackPromptKit,
  createPromptKitVersion,
  // A/B Tests
  createABTest,
  startABTest,
  endABTest,
  recordABTestResult,
  getABTest,
  getABTests,
  getABTestResults,
  calculateABTestStatistics,
  // Pipelines
  createPipeline,
  getPipeline,
  getPipelines,
  startPipelineRun,
  updatePipelineRun,
  // Activity
  logActivity,
  getActivityFeed
};
