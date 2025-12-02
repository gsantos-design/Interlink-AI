# Interlink AI

Multi-model orchestration hub with a landing page, Node/Express backend, and prompt race skeleton. Frontend is a static landing page ready for Codex/Render wiring. Backend ships with safe stubs so it runs without API keys; add keys to hit real providers.

## Quick start
1) Install deps: `npm install`
2) Copy `.env.example` to `.env` and fill your keys.
3) Run dev: `npm run dev` (or `npm start`)
4) Open `http://localhost:3000`

## Env
```
PORT=3000
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```
If a key is missing, the services return stubbed text so the UI still works.

## Frontend (public)
- `public/index.html` — landing page with hero, playground, prompt races, pricing, CTA
- `public/styles.css` — dark spectrum theme, responsive
- `public/app.js` — hooks for running prompts, races, and starting Stripe checkout (placeholder)

## Backend
- `server.js` — Express app, serves `public`, mounts API routes
- `routes/chatRoutes.js` — POST `/api/chat` { model, prompt }
- `routes/contestRoutes.js` — POST `/api/contest` { prompt, models[] } fan-out to providers, returns timings
- `routes/modelsRoutes.js` — GET `/api/models` for frontend toggles
- `routes/billingRoutes.js` — POST `/api/billing/create-checkout-session` (expects Stripe keys)
- `services/*Service.js` — OpenAI/Anthropic/Gemini helpers with real calls when keys exist and stub fallbacks otherwise

## Stripe
- Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` to enable checkout.
- Frontend buttons call `/api/billing/create-checkout-session` and redirect to `session.url`.
- Success/cancel URLs can be customized in `public/app.js` or request body.

## Deploying to Render
- Use a Node web service, set env vars above.
- Build command: `npm install`
- Start command: `npm start`
- Ensure `public` is served by Express; no separate static site needed.

## Notes
- Existing `Index.html` in the repo is untouched; new app lives under `/public`.
- Replace placeholder texts/links and tighten styles/content as needed.
