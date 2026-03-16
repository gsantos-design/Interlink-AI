
Built with OpenAI Codex — this branch (codex/code-validation) was developed using Codex for code generation, validation, and iterative refinement across the full stack.


What It Does
Interlink AI treats prompt engineering the way DevOps treats software development: with pipelines, A/B testing, performance analytics, and team collaboration — all in one platform.
Instead of manually comparing models or guessing which prompt works best, Interlink AI gives you the infrastructure to prove it — and the security tooling to validate it.

Key Features
🏁 Prompt Racing
Run the same prompt across multiple models simultaneously — OpenAI, Anthropic, Gemini, and Groq — and compare responses, latency, and quality in real time. See which model wins and why.
🔐 AI-Powered Code Validation
Multi-provider code quality and security review in a single API call. Submit code to OpenAI and Anthropic simultaneously, get normalized findings merged across providers.
jsonPOST /api/validate/code
{
  "code": "const password = 'secret';",
  "language": "javascript",
  "filename": "auth.js",
  "checks": ["quality", "security"],
  "providers": ["openai", "anthropic"]
}
Returns merged findings, normalized provider results, and graceful error handling if any provider fails.
🧪 A/B Testing Framework
Statistically rigorous prompt optimization with controlled experiments. Uses z-test for proportions with automatic significance detection at 95% confidence (z > 1.96). Stop guessing — know when Prompt B actually beats Prompt A.
🔁 CI/CD Pipeline for Prompts
Automate your prompt deployment workflow with configurable pipeline stages:

Lint — validate syntax and variables
Test — run against predefined test cases
Benchmark — compare performance across models
Deploy — promote to production

📊 Time-Series Performance Analytics
Track model performance over time with interactive Chart.js visualizations. Configure by time range (24h / 7d / 30d / 90d) and metric (latency, success rate, request volume, token usage).
👥 Real-Time Team Collaboration
Work together with Socket.IO-powered live collaboration — shared activity feeds, team chat, and experiment notifications. Gracefully degrades to local-only mode when offline.
💾 Backend Persistence
SQLite database stores all experiments, A/B tests, pipelines, and team activity. Full CRUD API with localStorage fallback.
🔄 Model Version Tracking
GET /api/model-updates returns live model version and status metadata — always know which model versions are active across providers.
🎙️ Voice & Vision Input
Voice input for hands-free prompting and image upload for multimodal model testing.

Model Support (12+)
ProviderModelsOpenAIGPT-4o, GPT-4, GPT-3.5 Turbo, o1, o3AnthropicClaude 3.5 Sonnet, Claude 3 Opus, Claude 3 HaikuGoogleGemini 1.5 Pro, Gemini 1.5 FlashGroqLlama 3, Mixtral (ultra-low latency)

Quick Start
bash# Clone the repository
git clone https://github.com/gsantos-design/Interlink-AI.git
cd Interlink-AI

# Switch to the active branch
git checkout codex/code-validation

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Start the server
npm start

# Open in browser
open http://localhost:3000
Environment Variables
envPORT=3000
OPENAI_API_KEY=
OPENAI_CODE_REVIEW_MODEL=gpt-4o
ANTHROPIC_API_KEY=
ANTHROPIC_CODE_REVIEW_MODEL=claude-3-haiku-20240307
GEMINI_API_KEY=
GROQ_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

Note: If a key is missing, services return intelligent stubs so the UI runs without any API keys.


Architecture
Layer         Technology        Purpose
────────────────────────────────────────────────────────
Server        Express.js        API routing and middleware
Database      SQLite            Persistent experiment storage
Real-time     Socket.IO         Live team collaboration
Charts        Chart.js          Time-series visualizations
Frontend      Vanilla JS + CSS  Responsive dark-theme UI
State         localStorage      Client-side fallback
Project Structure
Interlink-AI/
├── server.js                       # Express app + Socket.IO
├── db/
│   └── database.js                 # SQLite schema + connection
├── routes/
│   ├── chatRoutes.js               # POST /api/chat
│   ├── contestRoutes.js            # POST /api/contest (prompt race)
│   ├── modelsRoutes.js             # GET /api/models
│   ├── modelUpdatesRoutes.js       # GET /api/model-updates
│   ├── codeValidationRoutes.js     # POST /api/validate/code ← NEW
│   ├── analyticsRoutes.js          # Experiment tracking
│   ├── abTestRoutes.js             # A/B testing
│   ├── pipelineRoutes.js           # CI/CD pipelines
│   ├── collaborationRoutes.js      # Team management
│   └── billingRoutes.js            # Stripe checkout
├── services/
│   ├── openaiService.js
│   ├── anthropicService.js
│   ├── geminiService.js
│   └── groqService.js              # ← NEW
└── public/
    ├── index.html                  # Full platform UI
    ├── styles.css                  # Dark spectrum theme
    └── app.js                      # All frontend modules

Full API Reference
Chat & Models
POST /api/chat                  { model, prompt }
GET  /api/models                Available models with metadata
GET  /api/model-updates         Model version and status metadata
Prompt Racing
POST /api/contest               { prompt, models[] } → fan-out with timing results
Code Validation
POST /api/validate/code         { code, language, filename, checks[], providers[] }
                                → merged findings from multiple AI providers
Analytics
GET  /api/analytics/experiments     List experiments (paginated)
POST /api/analytics/experiments     Create experiment record
GET  /api/analytics/stats           Aggregate statistics
A/B Testing
GET  /api/ab-tests                  List all tests
POST /api/ab-tests                  Create test
POST /api/ab-tests/:id/start        Start test
POST /api/ab-tests/:id/end          End test, determine winner
POST /api/ab-tests/:id/record       Record individual result
CI/CD Pipelines
GET  /api/pipelines                 List pipelines
POST /api/pipelines                 Create pipeline with stages
POST /api/pipelines/:id/run         Trigger pipeline run
GET  /api/pipelines/:id/runs        Run history with logs
Team Collaboration
GET  /api/teams                     List user's teams
POST /api/teams                     Create team
POST /api/teams/:id/invite          Invite member
GET  /api/teams/:id/activity        Activity feed
Billing
POST /api/billing/create-checkout-session    Stripe checkout (requires keys)

Built with Codex
This branch was developed iteratively using OpenAI Codex for:

Route scaffolding and API design
Multi-provider service normalization
Code validation logic and merged findings algorithm
Frontend module architecture
Test case generation and stub fallback patterns

The development workflow: prompt → Codex generation → validation → refinement — applied across approximately 48 commits on this branch.

Deploying to Render

Create a Node web service in Render
Connect to codex/code-validation branch
Set environment variables
Build command: npm install
Start command: npm start

Live deployment: https://interlink-ai-1-codex-code-validation.onrender.com

Version History
VersionBranchKey Featuresv3.0 + Codexcodex/code-validationAll v3.0 features + AI code validation, Groq support, model version tracking — current live deploymentv3.0mainBackend persistence, real-time collaboration, CI/CD, time-series charts, A/B testingv2.0mainAnalytics dashboard, DevOps workflow pipeline, 12+ models, AI expert avatarsv1.0mainMulti-model playground, prompt racing, voice/vision input, expert mode

Built By
Giselle Santos — Founder & CPO, MiraElla Group
Carrier-grade multicloud, wireless, microservices, AI security, and government compliance architect. Background spans Nokia Nuage, Nokia Bell Labs, BT / BT-MIT Labs / Adastral Park, Honeywell, and Exiger — applying infrastructure-grade orchestration principles to AI model deployment at scale.
📧 hello@interlinkai.com
🔗 MiraElla Group

License
MIT
