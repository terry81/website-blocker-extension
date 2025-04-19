const blockedSitesTextarea = document.getElementById('blockedSites');
const saveButton = document.getElementById('save');

chrome.storage.sync.get("blockedSites", (data) => {
  if (data.blockedSites) {
    blockedSitesTextarea.value = data.blockedSites.join('\n');
  }
});

saveButton.addEventListener('click', () => {
  const blockedSites = blockedSitesTextarea.value.split('\n').filter(site => site.trim() !== "");
  chrome.storage.sync.set({ blockedSites }, () => {
    alert('Blocked sites saved!');
  });
});