Interlink AI
Enterprise-grade multi-model AI orchestration platform — run, race, test, and deploy prompts across 12+ AI models with statistical rigor, real-time collaboration, and CI/CD automation.

What It Does
Interlink AI treats prompt engineering the way DevOps treats software development: with pipelines, A/B testing, performance analytics, and team collaboration — all in one platform.
Instead of manually comparing models or guessing which prompt works best, Interlink AI gives you the infrastructure to prove it.

Key Features
🏁 Prompt Racing
Run the same prompt across multiple models simultaneously and compare responses, latency, and quality in real time. See which model wins — and why.
🧪 A/B Testing Framework
Statistically rigorous prompt optimization with controlled experiments. Uses z-test for proportions with automatic significance detection at 95% confidence (z > 1.96). Stop guessing — know when Prompt B actually beats Prompt A.
🔁 CI/CD Pipeline for Prompts
Automate your prompt deployment workflow with configurable pipeline stages:

Lint — validate syntax and variables
Test — run against predefined test cases
Benchmark — compare performance across models
Deploy — promote to production

📊 Time-Series Performance Analytics
Track model performance over time with interactive Chart.js visualizations. Configure by time range (24h / 7d / 30d / 90d) and metric (latency, success rate, request volume, token usage). Summary cards show week-over-week trends and best performer.
👥 Real-Time Team Collaboration
Work together with Socket.IO-powered live collaboration — shared activity feeds, team chat, and experiment notifications. Gracefully degrades to local-only mode when offline.
💾 Backend Persistence
SQLite database stores all experiments, A/B tests, pipelines, and team activity. Full CRUD API with localStorage fallback.
🎙️ Voice & Vision Input
Voice input for hands-free prompting and image upload for multimodal model testing.

Model Support (12+)
ProviderModelsOpenAIGPT-4o, GPT-4, GPT-3.5 Turbo, o1, o3AnthropicClaude 3.5 Sonnet, Claude 3 Opus, Claude 3 HaikuGoogleGemini 1.5 Pro, Gemini 1.5 Flash, Gemini Ultra+ moreExtensible via service layer

Quick Start
bash# Clone the repository
git clone 
cd Interlink-AI
https://interlink-ai-1-codex-code-validation.onrender.com/Default
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
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
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
├── server.js                    # Express app + Socket.IO
├── db/
│   └── database.js              # SQLite schema + connection
├── routes/
│   ├── chatRoutes.js            # POST /api/chat
│   ├── contestRoutes.js         # POST /api/contest (prompt race)
│   ├── modelsRoutes.js          # GET /api/models
│   ├── analyticsRoutes.js       # Experiment tracking
│   ├── abTestRoutes.js          # A/B testing
│   ├── pipelineRoutes.js        # CI/CD pipelines
│   ├── collaborationRoutes.js   # Team management
│   └── billingRoutes.js         # Stripe checkout
├── services/
│   ├── openaiService.js
│   ├── anthropicService.js
│   └── geminiService.js
└── public/
    ├── index.html               # Full platform UI
    ├── styles.css               # Dark spectrum theme
    └── app.js                   # All frontend modules

API Reference
Chat
POST /api/chat          { model, prompt }
GET  /api/models        Returns available models with metadata
Prompt Racing
POST /api/contest       { prompt, models[] } → fan-out with timing results
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

Deploying to Render

Create a Node web service in Render
Set environment variables (API keys above)
Build command: npm install
Start command: npm start
Render will serve the public/ directory via Express


Version History
VersionKey Featuresv3.0Backend persistence (SQLite), real-time collaboration (Socket.IO), CI/CD pipeline, time-series charts (Chart.js), A/B testing with statistical significancev2.0Research analytics dashboard, DevOps workflow pipeline, 12+ models, AI expert avatarsv1.0Multi-model playground, prompt racing, voice/vision input, expert mode, pricing

Built By Giselle Santos — Founder & CPO, MiraElla Group
Carrier-grade multicloud, wireless, microservices, AI security, and government compliance architect. Background spans Nokia Nuage, Nokia Bell Labs, BT / BT-MIT Labs / Adastral Park, Honeywell, and Exiger — applying infrastructure-grade orchestration principles to AI model deployment at scale.
📧 hello@interlinkai.com
🔗 MiraElla Group

License
MIT 


