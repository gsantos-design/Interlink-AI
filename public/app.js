const defaultModels = [
  { 
    id: 'openai', 
    label: 'ChatGPT (OpenAI)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/><rect x="8" y="4" width="8" height="2" rx="1"/></svg>', 
    color: '#10a37f',
    personality: 'Confident & Knowledgeable'
  },
  { 
    id: 'anthropic', 
    label: 'Claude (Anthropic)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5zm0 18c-4.4-1-7.5-4.7-7.5-8.5V8.3l7.5-3.8 7.5 3.8v3.2c0 3.8-3.1 7.5-7.5 8.5z"/><circle cx="12" cy="12" r="3"/></svg>', 
    color: '#6B4FBB',
    personality: 'Thoughtful & Precise'
  },
  { 
    id: 'gemini', 
    label: 'Gemini (Google)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>', 
    color: '#4285f4',
    personality: 'Creative & Unpredictable'
  },
  { 
    id: 'llama', 
    label: 'Llama 3.3 70B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="10" rx="8" ry="6"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5"/><rect x="10" y="2" width="4" height="4" rx="2"/></svg>', 
    color: '#0084ff',
    personality: 'Fast & Balanced'
  },
  { 
    id: 'kimi', 
    label: 'Kimi-K2 (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/><path d="M10 10l2 2 4-4" stroke="#02030a" stroke-width="1.5" fill="none"/></svg>', 
    color: '#ff6b35',
    personality: 'Agentic Reasoning Expert'
  },
  { 
    id: 'gptoss120b', 
    label: 'GPT-OSS 120B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>', 
    color: '#8b5cf6',
    personality: 'High-Capability Reasoning'
  },
  { 
    id: 'gptoss20b', 
    label: 'GPT-OSS 20B (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="5" height="5" rx="1"/><rect x="13" y="6" width="5" height="5" rx="1"/><rect x="6" y="13" width="5" height="5" rx="1"/><rect x="13" y="13" width="5" height="5" rx="1"/></svg>', 
    color: '#06b6d4',
    personality: 'Compact & Efficient'
  },
  { 
    id: 'compound', 
    label: 'Compound Beta (Groq)', 
    avatar: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="12" y1="9" x2="12" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>', 
    color: '#ec4899',
    personality: 'Multi-Model Orchestrator'
  },
];

let models = [...defaultModels];
let participants = [];

// A/B Testing Configuration
function initABTesting() {
  // Check if user already has a variant assigned
  let variant = localStorage.getItem('ab_variant');
  
  // If not, randomly assign variant A or B (50/50 split)
  if (!variant) {
    variant = Math.random() < 0.5 ? 'a' : 'b';
    localStorage.setItem('ab_variant', variant);
    
    // Track variant assignment
    console.log(`A/B Test: User assigned to variant ${variant.toUpperCase()}`);
  }
  
  // Apply variant class to body
  document.body.classList.add(`variant-${variant}`);
  
  // Optional: Send analytics event
  // trackEvent('ab_test_assignment', { variant });
}

const languageOptions = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-ES', label: 'Spanish (ES)' },
  { code: 'es-MX', label: 'Spanish (LatAm)' },
  { code: 'pt-BR', label: 'Portuguese (BR)' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Mandarin)' },
  { code: 'ar-SA', label: 'Arabic' },
];

let selectedVoiceLanguage = languageOptions[0].code;
const NATURAL_HINT = /(natural|neural|premium|studio|enhanced|hq|high quality|hd)/i;
const PROVIDER_HINT = /(microsoft|google|apple|amazon|openai)/i;

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

async function callModel(modelId, prompt, imageData = null) {
  const body = { model: modelId, prompt };
  if (imageData) {
    body.image = imageData;
  }
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
      (item, idx) => {
        const modelData = models.find(m => m.label === item.label) || {};
        return `
      <div class="result-item" data-result-idx="${idx}">
        <div class="result-head">
          <div class="model-info">
            <span class="model-avatar" style="background: ${modelData.color || '#333'}" title="${modelData.personality || ''}">${modelData.avatar || '🤖'}</span>
            <span>${item.label}</span>
          </div>
          <div class="head-actions">
            ${item.status === 'done' ? `<button class="speak-btn" data-idx="${idx}" title="Read aloud">🔊</button>` : ''}
            <span>${item.status}</span>
          </div>
        </div>
        <div class="result-body">${item.text}</div>
        ${item.status === 'done' ? `
          <div class="feedback-bar">
            <button class="feedback-btn thumbs-up" data-idx="${idx}" title="Good response">👍</button>
            <button class="feedback-btn thumbs-down" data-idx="${idx}" title="Bad response">👎</button>
            <select class="issue-select" data-idx="${idx}" title="Flag issue">
              <option value="">Flag issue...</option>
              <option value="wrong">Wrong/Incorrect</option>
              <option value="overconfident">Overconfident</option>
              <option value="hallucinated">Hallucinated</option>
              <option value="refused">Refused to answer</option>
              <option value="biased">Biased</option>
            </select>
            <button class="advanced-feedback-btn" data-idx="${idx}" title="Advanced feedback">📊</button>
          </div>
        ` : ''}
      </div>`;
      }
    )
    .join('');
  container.innerHTML = html;
  wireFeedbackButtons();
}

async function handlePlaygroundRun() {
  const promptEl = document.getElementById('playgroundPrompt');
  if (!promptEl) return;
  const prompt = promptEl.value.trim();
  if (!prompt) return;
  const selected = getSelectedModelIds();
  if (!selected.length) return;
  
  const imageNote = uploadedImageData ? ' (with image)' : '';
  renderPlaygroundResults(selected.map((id) => ({ label: id, status: 'running...' + imageNote, text: '' })));
  const results = [];
  for (const id of selected) {
    const meta = models.find((m) => m.id === id) || { label: id };
    try {
      const reply = await callModel(id, prompt, uploadedImageData);
      results.push({ label: meta.label, status: 'done', text: reply });
    } catch (err) {
      results.push({ label: meta.label, status: 'error', text: err.message });
    }
  }
  lastPlaygroundResults = results;
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
  const successful = results.filter(r => !r.error);
  const fastest = successful.length > 0 
    ? successful.reduce((min, r) => (r.latencyMs < min.latencyMs ? r : min), successful[0])
    : null;
  if (status) {
    if (fastest) {
      status.textContent = `Race complete. Total time: ${totalLatencyMs} ms. Fastest: ${fastest.model}.`;
    } else {
      status.textContent = `Race complete. All models failed or returned errors.`;
    }
  }
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
  if (winner) winner.textContent = fastest ? `Winner: ${fastest.model}` : 'No winner - all failed';
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
        successUrl: 'https://interlink-ai.onrender.com/?checkout=success',
        cancelUrl: 'https://interlink-ai.onrender.com/?checkout=cancel',
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

let lastPlaygroundResults = [];

async function submitFeedback(modelLabel, rating, issues, prompt, response, extraMetrics = {}) {
  try {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelLabel,
        prompt,
        response,
        rating,
        issues: Array.isArray(issues) ? issues : [issues],
        hallucinationSeverity: extraMetrics.hallucinationSeverity || 0,
        confidenceCalibration: extraMetrics.confidenceCalibration || 0,
        consistencyScore: extraMetrics.consistencyScore || 0,
        deceptionFlag: extraMetrics.deceptionFlag || false,
        notes: extraMetrics.notes || '',
      }),
    });
    console.log('Feedback submitted:', { modelLabel, rating, issues, extraMetrics });
  } catch (err) {
    console.error('Feedback error:', err);
  }
}

function showAdvancedFeedback(idx) {
  const result = lastPlaygroundResults[idx];
  if (!result) return;

  const metrics = prompt(
    `Advanced Feedback for ${result.label}\n\n` +
    `Enter metrics (comma-separated):\n` +
    `1. Hallucination Severity (1-5, 5=severe)\n` +
    `2. Confidence Calibration (1-5, 5=well-calibrated)\n` +
    `3. Consistency (1-5, 5=very consistent)\n` +
    `4. Deception Flag (y/n)\n` +
    `5. Notes (optional)\n\n` +
    `Example: 2,4,5,n,Seemed accurate`
  );

  if (!metrics) return;

  const parts = metrics.split(',').map(s => s.trim());
  const extraMetrics = {
    hallucinationSeverity: parseInt(parts[0]) || 0,
    confidenceCalibration: parseInt(parts[1]) || 0,
    consistencyScore: parseInt(parts[2]) || 0,
    deceptionFlag: (parts[3] || '').toLowerCase() === 'y',
    notes: parts[4] || '',
  };

  submitFeedback(result.label, 3, [], '', result.text, extraMetrics);
  alert(`Advanced feedback submitted for ${result.label}`);
}

function downloadFeedbackCSV() {
  window.location.href = '/api/feedback/download';
}

function wireFeedbackButtons() {
  document.querySelectorAll('.feedback-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const idx = parseInt(btn.dataset.idx);
      const result = lastPlaygroundResults[idx];
      if (!result) return;
      
      const rating = btn.classList.contains('thumbs-up') ? 5 : 1;
      btn.style.opacity = '0.5';
      await submitFeedback(result.label, rating, [], '', result.text);
    });
  });

  document.querySelectorAll('.issue-select').forEach((select) => {
    select.addEventListener('change', async (e) => {
      const idx = parseInt(select.dataset.idx);
      const result = lastPlaygroundResults[idx];
      if (!result || !select.value) return;
      
      await submitFeedback(result.label, 2, [select.value], '', result.text);
      select.value = '';
      alert(`Issue "${select.options[select.selectedIndex].text}" reported for ${result.label}`);
    });
  });

  document.querySelectorAll('.advanced-feedback-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.idx);
      showAdvancedFeedback(idx);
    });
  });
}

// Voice input/output
let recognition = null;
let isListening = false;

function scoreVoiceForLang(voice, lang) {
  if (!voice) return 0;
  const langMatch = matchesVoiceLang(voice, lang) ? 4 : 0;
  const naturalBonus = NATURAL_HINT.test(voice.name) ? 3 : 0;
  const providerBonus = PROVIDER_HINT.test(voice.name) ? 1 : 0;
  return langMatch + naturalBonus + providerBonus;
}

function populateLanguageSelect(selectId, value = selectedVoiceLanguage) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = languageOptions.map((opt) => `<option value="${opt.code}">${opt.label}</option>`).join('');
  select.value = value;
}

function matchesVoiceLang(voice, langCode) {
  if (!voice || !voice.lang || !langCode) return false;
  const target = voice.lang.toLowerCase();
  const normalized = langCode.toLowerCase();
  const base = normalized.split('-')[0];
  return target === normalized || target.startsWith(normalized) || target.startsWith(base);
}

function waitForVoices() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      resolve(voices);
      return;
    }
    const timeout = setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1200);
    const handler = () => {
      clearTimeout(timeout);
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
  });
}

async function populateVoiceOutputSelect(lang = selectedVoiceLanguage) {
  const select = document.getElementById('voiceOutputVoice');
  if (!select) return;
  const voices = await waitForVoices();
  const sorted = [...voices].sort((a, b) => scoreVoiceForLang(b, lang) - scoreVoiceForLang(a, lang));
  const candidates = sorted.length ? sorted : voices;
  const label = languageOptions.find((l) => l.code === lang)?.label || lang;
  const options = [
    `<option value="">Best voice for ${label}</option>`,
    ...candidates.map((v) => `<option value="${v.name}" data-lang="${v.lang}">${v.name} (${v.lang})</option>`),
  ];
  select.innerHTML = options.join('');
  const preferred = candidates[0];
  if (preferred) {
    select.value = preferred.name;
  }
}

function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Speech recognition not supported');
    return null;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = selectedVoiceLanguage;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const promptEl = document.getElementById('playgroundPrompt');
    if (promptEl) {
      promptEl.value = transcript;
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    updateMicButton();
  };
  
  recognition.onend = () => {
    isListening = false;
    updateMicButton();
  };
  
  return recognition;
}

function toggleVoiceInput() {
  if (!recognition) {
    recognition = initVoiceRecognition();
    if (!recognition) {
      alert('Voice input not supported in your browser. Try Chrome or Edge.');
      return;
    }
  }
  
  recognition.lang = selectedVoiceLanguage;
  if (isListening) {
    recognition.stop();
    isListening = false;
  } else {
    recognition.start();
    isListening = true;
  }
  updateMicButton();
}

function updateMicButton() {
  const btn = document.getElementById('voiceInputBtn');
  if (btn) {
    btn.textContent = isListening ? '🔴 Listening...' : '🎤 Voice Input';
    btn.classList.toggle('active', isListening);
  }
}

function getPreferredVoice(lang, voiceName = '') {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const ranked = [...voices].sort((a, b) => scoreVoiceForLang(b, lang) - scoreVoiceForLang(a, lang));
  if (voiceName) {
    const explicit = voices.find((v) => v.name === voiceName);
    if (explicit) return explicit;
  }
  return ranked[0] || voices[0];
}

function speakText(text, langOverride, voiceNameOverride) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported');
    return;
  }

  const lang = langOverride || document.getElementById('voiceLanguage')?.value || selectedVoiceLanguage;
  const requestedVoice = voiceNameOverride || document.getElementById('voiceOutputVoice')?.value || '';
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    waitForVoices().then((loaded) => {
      if (loaded.length) {
        speakText(text, lang, requestedVoice);
      } else {
        console.warn('No system voices available for playback.');
      }
    });
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = getPreferredVoice(lang, requestedVoice);
  if (voice) {
    utterance.voice = voice;
  }
  utterance.rate = 0.95;
  utterance.pitch = 1.02;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
}

async function initVoiceUI() {
  populateLanguageSelect('voiceLanguage', selectedVoiceLanguage);
  populateLanguageSelect('chatVoiceLang', selectedVoiceLanguage);
  await populateVoiceOutputSelect(selectedVoiceLanguage);
  await populateChatVoices();
  updateMicButton();
  updateChatMicButton(false);
}

// Example prompts
const examplePrompts = {
  'spanish-learning': 'Teach me 10 basic Spanish phrases for travelers with pronunciation tips.',
  'troubleshooting': 'I\'m getting a "Cannot read property of undefined" error in my React app. The error occurs when I try to access user.profile.name. How do I fix this?',
  'design-review': 'Review this landing page design: minimalist hero section, purple gradient background, sans-serif fonts. Is it modern enough for a SaaS product in 2025?',
  'code-refactor': 'Refactor this function to be more efficient: function findDuplicates(arr) { let dups = []; for(let i=0; i<arr.length; i++) { for(let j=i+1; j<arr.length; j++) { if(arr[i] === arr[j]) dups.push(arr[i]); } } return dups; }',
  'product-compare': 'Compare the pros and cons of using PostgreSQL vs MongoDB for a real-time chat application with 100k users.',
};

function loadExamplePrompt(key) {
  const promptEl = document.getElementById('playgroundPrompt');
  if (promptEl && examplePrompts[key]) {
    promptEl.value = examplePrompts[key];
  }
}

// Vision/Image upload
let uploadedImageData = null;

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageData = e.target.result;
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.innerHTML = `
        <div class="image-preview-content">
          <img src="${uploadedImageData}" alt="Uploaded image">
          <button class="remove-image-btn" onclick="clearImage()">✕ Remove</button>
        </div>
      `;
    }
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  uploadedImageData = null;
  const preview = document.getElementById('imagePreview');
  if (preview) {
    preview.innerHTML = '';
  }
  const input = document.getElementById('visionUpload');
  if (input) {
    input.value = '';
  }
}

function wireVoiceControls() {
  const voiceBtn = document.getElementById('voiceInputBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', toggleVoiceInput);
  }

  const voiceLangSelect = document.getElementById('voiceLanguage');
  if (voiceLangSelect) {
    voiceLangSelect.addEventListener('change', (e) => {
      selectedVoiceLanguage = e.target.value || selectedVoiceLanguage;
      if (recognition) {
        recognition.lang = selectedVoiceLanguage;
      }
      populateVoiceOutputSelect(selectedVoiceLanguage);
      const chatLangSelect = document.getElementById('chatVoiceLang');
      if (chatLangSelect) {
        chatLangSelect.value = selectedVoiceLanguage;
        populateChatVoices();
      }
    });
  }
  
  const chatVoiceLangSelect = document.getElementById('chatVoiceLang');
  if (chatVoiceLangSelect) {
    chatVoiceLangSelect.addEventListener('change', (e) => {
      const newLang = e.target.value || selectedVoiceLanguage;
      selectedVoiceLanguage = newLang;
      populateChatVoices();
      populateVoiceOutputSelect(newLang);
      if (chatRecognition) {
        chatRecognition.lang = newLang;
      }
      const voiceLang = document.getElementById('voiceLanguage');
      if (voiceLang) voiceLang.value = newLang;
    });
  }
  
  const exampleSelect = document.getElementById('exampleSelect');
  if (exampleSelect) {
    exampleSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        loadExamplePrompt(e.target.value);
        e.target.value = '';
      }
    });
  }

  const visionUpload = document.getElementById('visionUpload');
  if (visionUpload) {
    visionUpload.addEventListener('change', handleImageUpload);
  }

  // Add speak buttons to results
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('speak-btn')) {
      const idx = parseInt(e.target.dataset.idx);
      const result = lastPlaygroundResults[idx];
      if (result && result.text) {
        const lang = document.getElementById('voiceLanguage')?.value || selectedVoiceLanguage;
        const voiceName = document.getElementById('voiceOutputVoice')?.value || '';
        speakText(result.text, lang, voiceName);
      }
    }
  });
}

// Tutorial functions
let currentTutorialStep = 1;
const totalTutorialSteps = 5;

function showTutorial() {
  currentTutorialStep = 1;
  updateTutorialStep();
  document.getElementById('tutorialModal').style.display = 'flex';
}

function closeTutorial() {
  document.getElementById('tutorialModal').style.display = 'none';
  localStorage.setItem('interlinkTutorialSeen', 'true');
}

function replayTutorial() {
  localStorage.removeItem('interlinkTutorialSeen');
  showTutorial();
}

function nextTutorialStep() {
  if (currentTutorialStep < totalTutorialSteps) {
    currentTutorialStep++;
    updateTutorialStep();
  } else {
    closeTutorial();
  }
}

function prevTutorialStep() {
  if (currentTutorialStep > 1) {
    currentTutorialStep--;
    updateTutorialStep();
  }
}

function updateTutorialStep() {
  document.querySelectorAll('.tutorial-page').forEach((page, idx) => {
    page.style.display = (idx + 1) === currentTutorialStep ? 'block' : 'none';
  });
  document.getElementById('tutorialProgress').textContent = `${currentTutorialStep} / ${totalTutorialSteps}`;
  document.getElementById('tutorialPrev').disabled = currentTutorialStep === 1;
  document.getElementById('tutorialNext').textContent = currentTutorialStep === totalTutorialSteps ? 'Get Started!' : 'Next →';
}

// Community functions
async function submitIdea() {
  const input = document.getElementById('ideaInput');
  const idea = input.value.trim();
  if (!idea) return;
  
  try {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Community',
        rating: 5,
        notes: `IDEA: ${idea}`,
        issues: ['idea']
      }),
    });
    alert('Thank you! Your idea has been submitted. 💡');
    input.value = '';
  } catch (err) {
    alert('Error submitting idea. Please try again.');
  }
}

async function submitGeneralFeedback() {
  const input = document.getElementById('feedbackInput');
  const feedback = input.value.trim();
  if (!feedback) return;
  
  try {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Community',
        rating: 3,
        notes: `FEEDBACK: ${feedback}`,
        issues: ['feedback']
      }),
    });
    alert('Thank you! Your feedback helps us improve. 🙏');
    input.value = '';
  } catch (err) {
    alert('Error submitting feedback. Please try again.');
  }
}

// ========== One-on-One Chat ==========
let currentTutor = null;
let chatRecognition = null;
let chatHistory = [];
let chatMicActive = false;

const tutorProfiles = {
  einstein: {
    name: 'Robo Einstein',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/400px-Albert_Einstein_Head.jpg',
    isImage: true,
    greeting: "Hello! I'm Robo Einstein. Let's explore the wonders of science and physics together!",
    systemPrompt: 'You are Robo Einstein, a friendly and enthusiastic science teacher inspired by Albert Einstein. Explain concepts clearly with warmth and curiosity, using analogies and real-world examples. Keep responses conversational and encouraging.'
  },
  prof: {
    name: 'Robo Prof',
    icon: '📚',
    greeting: "Welcome! I'm Robo Prof, your academic tutor. What subject shall we study today?",
    systemPrompt: 'You are Robo Prof, an academic tutor. Help students learn any subject with patience, clarity, and encouragement.'
  },
  mentor: {
    name: 'Robot Mentor',
    icon: '🤖',
    greeting: "Hi there! I'm Robot Mentor. Let's talk about your career goals and how to achieve them.",
    systemPrompt: 'You are Robot Mentor, a career guidance counselor. Provide practical career advice, motivation, and strategic thinking.'
  },
  sage: {
    name: 'AI Sage',
    icon: '🧙',
    greeting: "Greetings! I'm AI Sage. Together we'll explore philosophy, wisdom, and the deeper questions of life.",
    systemPrompt: 'You are AI Sage, a philosophical guide. Discuss deep questions, ethics, and wisdom with thoughtful reflection.'
  },
  cyber: {
    name: 'Cyber Tutor',
    icon: '💻',
    greeting: "Hey! I'm Cyber Tutor. Ready to learn about technology, coding, and digital innovation?",
    systemPrompt: 'You are Cyber Tutor, a tech and coding expert. Teach programming, technology concepts, and problem-solving skills.'
  }
};

function selectTutor(avatar) {
  currentTutor = avatar;
  const profile = tutorProfiles[avatar];
  const voiceLangSelect = document.getElementById('chatVoiceLang');
  if (voiceLangSelect && !voiceLangSelect.value) {
    voiceLangSelect.value = selectedVoiceLanguage;
  }
  
  // Update UI
  const avatarElement = document.getElementById('activeTutorIcon');
  if (profile.isImage) {
    avatarElement.innerHTML = `<img src="${profile.icon}" alt="${profile.name}" class="tutor-avatar-img" />`;
  } else {
    avatarElement.textContent = profile.icon;
  }
  document.getElementById('activeTutorName').textContent = profile.name;
  document.getElementById('tutorGreeting').textContent = profile.name;
  
  // Show chat interface
  document.querySelector('.avatar-selection').style.display = 'none';
  document.getElementById('chatInterface').style.display = 'block';
  
  // Populate voices
  populateChatVoices();
  
  // Clear history and add greeting
  chatHistory = [];
  const messagesDiv = document.getElementById('chatMessages');
  const avatarHTML = profile.isImage 
    ? `<img src="${profile.icon}" alt="${profile.name}" class="message-avatar-img" />`
    : profile.icon;
  messagesDiv.innerHTML = `
    <div class="chat-message assistant">
      <div class="message-avatar">${avatarHTML}</div>
      <div class="message-content">
        <p>${profile.greeting}</p>
      </div>
    </div>
  `;
  
  // Initialize voice recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    chatRecognition = new SpeechRecognition();
    chatRecognition.continuous = false;
    chatRecognition.interimResults = false;
    chatRecognition.lang = voiceLangSelect?.value || selectedVoiceLanguage;
    
    chatRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('chatInput').value = transcript;
      sendChatMessage();
    };
    
    chatRecognition.onerror = (event) => {
      console.error('Chat speech recognition error:', event.error);
      updateChatMicButton(false);
    };
    
    chatRecognition.onend = () => {
      updateChatMicButton(false);
    };
  }
}

async function populateChatVoices() {
  const voiceSelect = document.getElementById('chatVoice');
  if (!voiceSelect) return;
  const langSelect = document.getElementById('chatVoiceLang');
  const lang = langSelect?.value || selectedVoiceLanguage;
  const voices = await waitForVoices();

  if (!voices.length) {
    voiceSelect.innerHTML = '<option value="">No system voices found</option>';
    return;
  }

  const ranked = [...voices].sort((a, b) => scoreVoiceForLang(b, lang) - scoreVoiceForLang(a, lang));

  voiceSelect.innerHTML = ranked
    .map((voice) => `<option value="${voice.name}" data-lang="${voice.lang}">${voice.name} (${voice.lang})</option>`)
    .join('');

  const preferred = ranked[0];
  voiceSelect.value = preferred?.name || '';
}

function toggleChatVoice() {
  if (!chatRecognition) {
    alert('Voice input not supported in your browser');
    return;
  }
  
  const lang = document.getElementById('chatVoiceLang')?.value || selectedVoiceLanguage;
  chatRecognition.lang = lang;
  if (chatMicActive) {
    chatRecognition.stop();
    updateChatMicButton(false);
  } else {
    chatRecognition.start();
    updateChatMicButton(true);
  }
}

function updateChatMicButton(isListening) {
  chatMicActive = !!isListening;
  const micBtn = document.getElementById('chatMic');
  if (!micBtn) return;
  micBtn.textContent = chatMicActive ? 'Listening…' : '🎤';
  micBtn.classList.toggle('active', chatMicActive);
  micBtn.title = chatMicActive ? 'Stop listening' : 'Start voice input';
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;
  
  // Add user message to UI
  addChatMessage(message, 'user');
  input.value = '';
  
  // Get selected model
  const modelSelect = document.getElementById('chatModel');
  const modelId = modelSelect.value;
  
  // Add to history
  const profile = tutorProfiles[currentTutor];
  chatHistory.push({ role: 'user', content: message });
  
  // Build prompt with context
  const contextPrompt = `${profile.systemPrompt}\n\nConversation history:\n${
    chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')
  }\n\nRespond to the user's latest message.`;
  
  try {
    // Show typing indicator
    const typingId = addChatMessage('...', 'assistant', true);
    
    // Call API with Safe Mode check
    const safeMode = checkSafeMode();
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: contextPrompt, model: modelId, safeMode }),
    });
    
    const data = await res.json();
    const response = data.reply || data.response || 'Sorry, I had trouble processing that.';
    
    // Remove typing indicator
    document.getElementById(typingId)?.remove();
    
    // Add assistant response
    addChatMessage(response, 'assistant');
    chatHistory.push({ role: 'assistant', content: response });
    
    // Speak response
    speakChatMessage(response);
    
  } catch (err) {
    console.error('Chat error:', err);
    addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
  }
}

function addChatMessage(text, role, isTyping = false) {
  const messagesDiv = document.getElementById('chatMessages');
  const messageId = `msg-${Date.now()}`;
  const profile = tutorProfiles[currentTutor];
  
  const avatarHTML = profile && profile.isImage 
    ? `<img src="${profile.icon}" alt="${profile.name}" class="message-avatar-img" />`
    : (profile ? profile.icon : '🤖');
  
  const messageHTML = role === 'user' 
    ? `<div class="chat-message user" id="${messageId}">
         <div class="message-content"><p>${text}</p></div>
         <div class="message-avatar">👤</div>
       </div>`
    : `<div class="chat-message assistant" id="${messageId}">
         <div class="message-avatar">${avatarHTML}</div>
         <div class="message-content ${isTyping ? 'typing' : ''}"><p>${text}</p></div>
       </div>`;
  
  messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  return messageId;
}

function speakChatMessage(text) {
  if (!('speechSynthesis' in window)) return;
  const lang = document.getElementById('chatVoiceLang')?.value || selectedVoiceLanguage;
  const voiceName = document.getElementById('chatVoice')?.value || '';
  const avatar = document.querySelector('.tutor-avatar-large');
  
  waitForVoices().then((voices) => {
    if (!voices.length) {
      console.warn('No system voices available for chat playback.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = getPreferredVoice(lang, voiceName);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
  
    if (avatar) {
      avatar.classList.add('speaking');
    }
  
    utterance.onend = () => {
      if (avatar) {
        avatar.classList.remove('speaking');
      }
    };
  
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

function endChat() {
  currentTutor = null;
  chatHistory = [];
  document.querySelector('.avatar-selection').style.display = 'block';
  document.getElementById('chatInterface').style.display = 'none';
  document.getElementById('chatInput').value = '';
}

// ========== Age Verification & Safety ==========
function showAgeVerification() {
  const modal = document.getElementById('ageVerificationModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function verifyAge() {
  const birthdateInput = document.getElementById('birthdate');
  const birthdate = new Date(birthdateInput.value);
  
  if (!birthdateInput.value) {
    alert('Please enter your date of birth.');
    return;
  }
  
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  const dayDiff = today.getDate() - birthdate.getDate();
  
  // Adjust age if birthday hasn't occurred this year
  const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
  
  // Store age verification
  localStorage.setItem('interlinkAgeVerified', 'true');
  localStorage.setItem('interlinkUserAge', actualAge);
  
  if (actualAge < 13) {
    // Under 13 - deny access
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('ageDeniedStep').style.display = 'block';
  } else if (actualAge < 18) {
    // 13-17 - require parental consent
    localStorage.setItem('interlinkSafeMode', 'true');
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('parentalConsentStep').style.display = 'block';
  } else {
    // 18+ - full access
    localStorage.setItem('interlinkSafeMode', 'false');
    document.getElementById('ageVerificationStep1').style.display = 'none';
    document.getElementById('ageVerifiedStep').style.display = 'block';
  }
}

function submitParentalConsent() {
  const parentEmail = document.getElementById('parentEmail').value;
  const consentChecked = document.getElementById('parentConsent').checked;
  
  if (!parentEmail || !consentChecked) {
    alert('Please provide your parent/guardian email and confirm consent.');
    return;
  }
  
  // Store parental consent (in production, send verification email)
  localStorage.setItem('interlinkParentEmail', parentEmail);
  localStorage.setItem('interlinkParentalConsent', 'true');
  
  document.getElementById('parentalConsentStep').style.display = 'none';
  document.getElementById('ageVerifiedStep').style.display = 'block';
  
  // In production: Send verification email to parent
  console.log('Parental consent collected for:', parentEmail);
}

function closeAgeVerification() {
  const modal = document.getElementById('ageVerificationModal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Show tutorial for first-time users
  if (!localStorage.getItem('interlinkTutorialSeen')) {
    setTimeout(showTutorial, 500);
  }
}

function checkSafeMode() {
  return localStorage.getItem('interlinkSafeMode') === 'true';
}

// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  // A/B Testing: Randomly assign variant
  initABTesting();
  
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
  wireVoiceControls();
  await initVoiceUI();
  
  // Load voices for TTS
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    // Reload when voices change (some browsers load async)
    window.speechSynthesis.onvoiceschanged = () => {
      populateVoiceOutputSelect(document.getElementById('voiceLanguage')?.value || selectedVoiceLanguage);
      populateChatVoices();
    };
  }

  // Check age verification on first visit
  if (!localStorage.getItem('interlinkAgeVerified')) {
    setTimeout(showAgeVerification, 500);
  } else if (!localStorage.getItem('interlinkTutorialSeen')) {
    // Show tutorial for verified users who haven't seen it
    setTimeout(showTutorial, 1000);
  }
});
