async function injectIntoEssentialTabs() {
  try {
    const tabs = await chrome.tabs.query({ url: 'https://www.essentialai-app.com/*' });
    for (const tab of tabs) {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }).catch(() => {});
    }
  } catch (_) {}
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'scan-essential',
      title: 'Scan with Essential',
      contexts: ['image'],
    });
  });
  injectIntoEssentialTabs();
});

chrome.runtime.onStartup.addListener(injectIntoEssentialTabs);

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'scan-essential') return;
  const url = info.srcUrl;
  if (!url) return;

  await chrome.storage.local.set({ pendingScan: url });

  try {
    await chrome.action.openPopup();
  } catch (_) {
    // openPopup() unavailable on older Chrome — show badge so user knows to click the icon
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#5ba39e' });
  }
});
