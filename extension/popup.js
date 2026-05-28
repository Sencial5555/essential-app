const API = 'https://www.essentialai-app.com/api/scan';

const VERDICTS = {
  human:      { label: 'Likely Human',  color: '#5ba39e', bg: 'rgba(91,163,158,0.12)',  border: 'rgba(91,163,158,0.25)',  desc: 'No meaningful AI generation signatures detected.' },
  suspicious: { label: 'Mixed Signals', color: '#d4a05a', bg: 'rgba(212,160,90,0.12)',  border: 'rgba(212,160,90,0.28)',  desc: 'Some patterns suggest possible AI involvement.' },
  ai:         { label: 'AI Generated',  color: '#d46a5e', bg: 'rgba(212,106,94,0.12)',  border: 'rgba(212,106,94,0.28)',  desc: 'High confidence — AI generation signatures detected.' },
};

const GENERATOR_NAMES = {
  midjourney: 'Midjourney', dalle: 'DALL·E', stable_diffusion: 'Stable Diffusion',
  flux: 'Flux', firefly: 'Adobe Firefly', ideogram: 'Ideogram', gpt4o: 'GPT-4o Image',
};

let lastUrl = null;

document.addEventListener('DOMContentLoaded', async () => {
  chrome.action.setBadgeText({ text: '' });

  let { essentialAuth, pendingScan } = await chrome.storage.local.get(['essentialAuth', 'pendingScan']);

  if (!essentialAuth) {
    essentialAuth = await syncFromOpenTab();
  }

  if (!essentialAuth) {
    await chrome.storage.local.remove('pendingScan');
    showSignInRequired();
    return;
  }

  if (pendingScan) {
    lastUrl = pendingScan;
    await chrome.storage.local.remove('pendingScan');
    scan(lastUrl);
  } else {
    showIdle();
  }
});

function showSignInRequired() {
  set(`
    <div class="idle-wrap">
      <div class="idle-icon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <p class="idle-msg">Sign in to Essential to use the extension</p>
    </div>
    <a class="open-link" href="https://www.essentialai-app.com" target="_blank">Sign in at Essential &rarr;</a>
  `);
}

function showIdle() {
  set(`
    <div class="idle-wrap">
      <div class="idle-icon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <p class="idle-msg">Right-click any image on the web<br>and select <strong>Scan with Essential</strong></p>
    </div>
    <a class="open-link" href="https://www.essentialai-app.com" target="_blank">Open Essential &rarr;</a>
  `);
}

function showScanning(thumbUrl) {
  const thumbHtml = thumbUrl
    ? `<img src="${esc(thumbUrl)}" style="width:100%; max-height:90px; object-fit:cover; border-radius:8px; margin-bottom:12px;" onerror="this.style.display='none'">`
    : '';
  set(`
    ${thumbHtml}
    <div class="scanning-wrap">
      <div class="spinner"></div>
      <span class="scanning-label">Analysing&hellip;</span>
    </div>
  `);
}

function showResult(data, thumbUrl) {
  const v = VERDICTS[data.type] || VERDICTS.human;

  const thumbHtml = thumbUrl
    ? `<img src="${esc(thumbUrl)}" class="thumb" onerror="this.style.display='none'">`
    : '';

  const generatorHtml = (data.generator && data.type !== 'human')
    ? `<p class="generator">Likely source: <span>${esc(GENERATOR_NAMES[data.generator] || data.generator)}</span></p>`
    : '';

  set(`
    <div class="result-card" style="border-color:${v.border}">
      <div class="result-top">
        ${thumbHtml}
        <div>
          <div class="result-score" style="color:${v.color}">${data.score}%</div>
          <span class="result-badge" style="color:${v.color}; background:${v.bg}; border-color:${v.border}">${v.label}</span>
        </div>
      </div>
      <p class="result-desc">${v.desc}</p>
      ${generatorHtml}
      ${signalsHtml(data.technical, data.visual, data.type, v.color)}
    </div>
    <div class="actions">
      <button class="btn btn-secondary" id="btn-new">New scan</button>
      <a class="btn btn-primary" href="https://www.essentialai-app.com" target="_blank">Open app &rarr;</a>
    </div>
  `);

  document.getElementById('btn-new').addEventListener('click', showIdle);
}

function showError(message) {
  set(`
    <div class="error-wrap">
      <p class="error-msg">${esc(message)}</p>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" id="btn-retry">Try again</button>
      <a class="btn btn-primary" href="https://www.essentialai-app.com" target="_blank">Open app &rarr;</a>
    </div>
  `);
  document.getElementById('btn-retry').addEventListener('click', () => {
    if (lastUrl) scan(lastUrl);
    else showIdle();
  });
}

async function scan(url) {
  showScanning(url);
  try {
    const { essentialAuth } = await chrome.storage.local.get('essentialAuth');
    const headers = {};
    if (essentialAuth) {
      headers['Authorization'] = `Bearer ${essentialAuth.token}`;
      headers['X-User-Id']     = essentialAuth.userId;
    }
    const form = new FormData();
    form.append('url', url);
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const res = await fetch(API, { method: 'POST', body: form, headers, signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.error === 'quota_exceeded') {
        showError("You've used all your scans. Open Essential to upgrade.");
        return;
      }
      throw new Error(body.error || `Server error (${res.status})`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showResult(data, url);
    notifyWebsite(data, url);
  } catch (e) {
    showError(e.message || 'Something went wrong. Try uploading on essentialai-app.com.');
  }
}

function signalsHtml(technical, visual, type, verdictColor) {
  if (technical === null && visual === null) return '';

  const rows = [];

  if (technical === null) {
    rows.push(rowHtml('Technical analysis', null, 'N/A', 'rgba(255,255,255,0.2)'));
  } else if (technical <= 8) {
    rows.push(rowHtml('Technical analysis', null, 'Not detected', 'rgba(255,255,255,0.2)'));
  } else {
    rows.push(rowHtml('Technical analysis', technical / 100, `${technical}%`, verdictColor));
  }

  if (visual !== null) {
    const agreeing = (type === 'ai' && visual > 50) || (type === 'human' && visual <= 50);
    const barColor = agreeing ? verdictColor : '#5ba39e';
    rows.push(rowHtml('Visual perception', Math.max(visual / 100, 0.05), `${visual}%`, barColor));
  }

  return `
    <div class="signals">
      <p class="signals-heading">Signal Breakdown</p>
      ${rows.join('')}
    </div>
  `;
}

function rowHtml(name, fill, label, color) {
  const fillStyle = fill === null
    ? 'width:8px; background:rgba(255,255,255,0.15)'
    : `width:${Math.round(fill * 100)}%; background:${color}`;
  const pctStyle = fill === null ? 'font-size:10px; color:#6b7477' : '';
  return `
    <div class="signal-row">
      <span class="signal-name">${name}</span>
      <div class="signal-track"><div class="signal-fill" style="${fillStyle}"></div></div>
      <span class="signal-pct" style="${pctStyle}">${label}</span>
    </div>
  `;
}

const HISTORY_CONFIGS = {
  human:      { label: 'Human',        color: 'var(--result-green)',   bg: 'rgba(62,124,120,0.10)',  border: 'rgba(62,124,120,0.25)' },
  suspicious: { label: 'Mixed signals', color: 'var(--result-amber)',  bg: 'rgba(212,160,90,0.10)',  border: 'rgba(212,160,90,0.28)' },
  ai:         { label: 'AI Generated', color: 'var(--result-crimson)', bg: 'rgba(212,106,94,0.10)', border: 'rgba(212,106,94,0.28)' },
};

function notifyWebsite(scanData, imgUrl) {
  chrome.storage.local.get('essentialAuth').then(({ essentialAuth }) => {
    const userId = essentialAuth?.userId;
    const cfg    = HISTORY_CONFIGS[scanData?.type] || HISTORY_CONFIGS.human;

    let name = 'image';
    try {
      const u = new URL(imgUrl);
      name = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
    } catch (_) {}

    if (userId) {
      chrome.storage.local.set({
        pendingHistoryEntry: {
          entry: {
            type: scanData.type, label: cfg.label, color: cfg.color,
            bg: cfg.bg, border: cfg.border, score: scanData.score,
            name, thumb: imgUrl, full: imgUrl, at: Date.now(),
          },
          historyKey: `essential-scan-history-v1-${userId}`,
        }
      });
    }

    // Fire quota refresh event directly into open website tabs
    chrome.tabs.query({ url: 'https://www.essentialai-app.com/*' })
      .then(tabs => tabs.forEach(tab =>
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: () => window.dispatchEvent(new CustomEvent('essential:quota-changed')),
        }).catch(() => {})
      )).catch(() => {});
  });
}

async function syncFromOpenTab() {
  try {
    const tabs = await chrome.tabs.query({ url: 'https://www.essentialai-app.com/*' });
    if (!tabs.length) return null;
    for (const tab of tabs) {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }).catch(() => {});
    }
    await new Promise(r => setTimeout(r, 300));
    const { essentialAuth } = await chrome.storage.local.get('essentialAuth');
    return essentialAuth || null;
  } catch (_) {
    return null;
  }
}

function set(html) {
  document.getElementById('content').innerHTML = html;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
