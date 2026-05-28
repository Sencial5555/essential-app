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

syncAuth();
window.addEventListener('storage', syncAuth);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'quota-changed') {
    window.dispatchEvent(new CustomEvent('essential:quota-changed'));
  }
});
