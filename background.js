let blockedSites = [];

chrome.storage.sync.get("blockedSites", (data) => {
  if (data.blockedSites) {
    blockedSites = data.blockedSites;
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue;
  }
});

function isBlocked(url) {
  return blockedSites.some(site =>
    url.startsWith(`http://${site}`) ||
    url.startsWith(`https://${site}`) ||
    url.startsWith(`http://www.${site}`) ||
    url.startsWith(`https://www.${site}`)
  );
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;
  if (details.frameId === 0 && isBlocked(url)) {
    chrome.tabs.update(details.tabId, { url: "blocked.html" });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active && isBlocked(changeInfo.url)) {
    chrome.tabs.update(tabId, { url: "blocked.html" });
  }
});