const defaultModels = [
  { id: 'openai', label: 'ChatGPT (OpenAI)' },
  { id: 'anthropic', label: 'Claude (Anthropic)' },
  { id: 'gemini', label: 'Gemini (Google)' },
];

let models = [...defaultModels];
let participants = [];

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

async function fetchModels() {
  try {
    const res = await fetch('/api/models');
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.models) && data.models.length) {
      models = data.models;
    }
  } catch (err) {
    console.warn('Using default models', err);
  }
}

function renderModelToggles() {
  const container = document.getElementById('model-toggles');
  if (!container) return;
  container.innerHTML = '';
  models.forEach((model, idx) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = model.id;
    input.checked = idx < 3;
    const span = document.createElement('span');
    span.textContent = model.label;
    label.appendChild(input);
    label.appendChild(span);
    container.appendChild(label);
  });
}

function getSelectedModelIds() {
  const container = document.getElementById('model-toggles');
  if (!container) return models.map((m) => m.id);
  const boxes = container.querySelectorAll('input[type="checkbox"]');
  const selected = [];
  boxes.forEach((box) => {
    if (box.checked) selected.push(box.value);
  });
  return selected.length ? selected : models.map((m) => m.id);
}

async function callModel(modelId, prompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelId, prompt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data.reply || '';
}

function setHeroState(modelId, statusText, content) {
  const card = document.querySelector(`.output-card[data-model="${modelId}"]`);
  if (!card) return;
  const statusEl = card.querySelector('.status');
  const outEl = card.querySelector('.output-text');
  if (statusEl) statusEl.textContent = statusText || '';
  if (outEl && typeof content === 'string') outEl.textContent = content;
}

async function handleHeroRun() {
  const promptEl = document.getElementById('heroPrompt');
  if (!promptEl) return;
  const prompt = promptEl.value.trim();
  if (!prompt) return;
  const targets = models.map((m) => m.id);
  targets.forEach((id) => setHeroState(id, 'running...', '')); 
  await Promise.all(
    targets.map(async (id) => {
      try {
        const reply = await callModel(id, prompt);
        setHeroState(id, 'done', reply);
      } catch (err) {
        setHeroState(id, 'error', err.message);
      }
    })
  );
}

function renderPlaygroundResults(items) {
  const container = document.getElementById('playgroundResults');
  if (!container) return;
  if (!items || !items.length) {
    container.innerHTML = '<div class="placeholder">Outputs will appear here after you run.</div>';
    return;
  }
  const html = items
    .map(
      (item) => `
      <div class="result-item">
        <div class="result-head"><span>${item.label}</span><span>${item.status}</span></div>
        <div class="result-body">${item.text}</div>
      </div>`
    )
    .join('');
  container.innerHTML = html;
}

async function handlePlaygroundRun() {
  const promptEl = document.getElementById('playgroundPrompt');
  if (!promptEl) return;
  const prompt = promptEl.value.trim();
  if (!prompt) return;
  const selected = getSelectedModelIds();
  if (!selected.length) return;
  renderPlaygroundResults(selected.map((id) => ({ label: id, status: 'running...', text: '' })));
  const results = [];
  for (const id of selected) {
    const meta = models.find((m) => m.id === id) || { label: id };
    try {
      const reply = await callModel(id, prompt);
      results.push({ label: meta.label, status: 'done', text: reply });
    } catch (err) {
      results.push({ label: meta.label, status: 'error', text: err.message });
    }
  }
  renderPlaygroundResults(results);
}

function renderParticipants() {
  const list = document.getElementById('participantList');
  if (!list) return;
  if (!participants.length) {
    list.innerHTML = '<div class="placeholder">No participants yet.</div>';
    return;
  }
  list.innerHTML = '';
  participants.forEach((name) => {
    const chip = document.createElement('div');
    chip.className = 'participant-chip';
    chip.textContent = name;
    list.appendChild(chip);
  });
}

function addParticipant() {
  const input = document.getElementById('participantName');
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  participants.push(name);
  input.value = '';
  renderParticipants();
}

function renderRaceEntries(payload) {
  const entries = document.getElementById('raceEntries');
  const status = document.getElementById('raceStatus');
  const winner = document.getElementById('raceWinner');
  if (!entries) return;
  if (!payload || !Array.isArray(payload.results) || !payload.results.length) {
    entries.innerHTML = '<div class="placeholder">Run a race to see model answers and timings.</div>';
    if (status) status.textContent = 'No race running.';
    if (winner) winner.textContent = '';
    return;
  }
  const { results, totalLatencyMs } = payload;
  const fastest = results.reduce((min, r) => (r.latencyMs < min.latencyMs ? r : min), results[0]);
  if (status) status.textContent = `Race complete. Total time: ${totalLatencyMs} ms. Fastest: ${fastest.model}.`;
  const html = results
    .map(
      (r) => `
        <div class="result-item">
          <div class="result-head"><span>${r.model}</span><span>${r.latencyMs} ms</span></div>
          <div class="result-body">${r.text || ''}</div>
        </div>`
    )
    .join('');
  entries.innerHTML = html;
  if (winner) winner.textContent = `Winner: ${fastest.model}`;
}

async function handleRaceStart() {
  const title = document.getElementById('raceTitle')?.value.trim() || '';
  const rules = document.getElementById('raceRules')?.value.trim() || '';
  const raceStatus = document.getElementById('raceStatus');
  const prompt = title || rules ? `Challenge: ${title}\nRules: ${rules}` : 'Prompt race';
  if (!raceStatus) return;
  raceStatus.textContent = 'Running race...';
  try {
    const res = await fetch('/api/contest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, models: getSelectedModelIds() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Server error');
    renderRaceEntries(data);
  } catch (err) {
    raceStatus.textContent = 'Race failed. Check server logs.';
    console.error(err);
  }
}

async function startCheckout(plan) {
  try {
    const res = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        successUrl: window.location.origin + '/?checkout=success',
        cancelUrl: window.location.origin + '/?checkout=cancel',
        plan,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Stripe is not configured yet. Add STRIPE keys on the backend.');
    }
  } catch (err) {
    alert('Error starting checkout.');
  }
}

function wirePricingButtons() {
  document.querySelectorAll('.checkout-btn').forEach((btn) => {
    btn.addEventListener('click', () => startCheckout(btn.dataset.plan || 'starter'));
  });
}

function wireCTA() {
  const cta = document.getElementById('ctaStart');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function wireParticipants() {
  const addBtn = document.getElementById('addParticipant');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addParticipant();
    });
  }
}

function wireHero() {
  const btn = document.getElementById('heroRun');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleHeroRun();
    });
  }
}

function wirePlayground() {
  const btn = document.getElementById('playgroundRun');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handlePlaygroundRun();
    });
  }
}

function wireRace() {
  const btn = document.getElementById('startRace');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleRaceStart();
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setYear();
  await fetchModels();
  renderModelToggles();
  renderParticipants();
  renderPlaygroundResults();
  renderRaceEntries();
  wireHero();
  wirePlayground();
  wireRace();
  wirePricingButtons();
  wireCTA();
  wireParticipants();
});
