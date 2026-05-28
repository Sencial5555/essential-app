// Runs on essentialai-app.com — syncs the logged-in user's auth token
// to extension storage so the popup can authenticate API calls.
function syncAuth() {
  try {
    const raw = localStorage.getItem('sb-tjzjwyjggmrcmwawrtpm-auth-token');
    if (!raw) { chrome.storage.local.remove('essentialAuth'); return; }
    const parsed = JSON.parse(raw);
    const token  = parsed?.access_token;
    const userId = parsed?.user?.id;
    if (token && userId && parsed.expires_at > Date.now() / 1000) {
      chrome.storage.local.set({ essentialAuth: { token, userId } });
    } else {
      chrome.storage.local.remove('essentialAuth');
    }
  } catch (_) {}
}

function processPendingHistory() {
  chrome.storage.local.get('pendingHistoryEntry', ({ pendingHistoryEntry }) => {
    if (!pendingHistoryEntry) return;
    chrome.storage.local.remove('pendingHistoryEntry');
    const { entry, historyKey } = pendingHistoryEntry;
    if (!entry || !historyKey) return;
    try {
      const arr = JSON.parse(localStorage.getItem(historyKey) || '[]');
      localStorage.setItem(historyKey, JSON.stringify([entry, ...arr].slice(0, 20)));
      window.dispatchEvent(new CustomEvent('essential:history-changed'));
    } catch (_) {}
  });
}

syncAuth();
window.addEventListener('storage', syncAuth);

// Process any history entry saved while the site wasn't open
processPendingHistory();

// Process in real-time when popup scans while site is open
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.pendingHistoryEntry?.newValue) {
    processPendingHistory();
  }
});
