chrome.action.onClicked.addListener(async (tab) => {
  // Blokir URL khusus
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) return;

  // Simpan data tab secara aman
  await chrome.storage.session.set({ 
    [tab.id]: { id: tab.id, url: tab.url } 
  });

  // Buka popup dengan ukuran responsif
  try {
    const win = await chrome.windows.getCurrent();
    await chrome.windows.create({
      url: chrome.runtime.getURL(`popup.html?tabid=${tab.id}`),
      type: "popup",
      width: Math.min(770, win.width * 0.8),
      height: Math.min(650, win.height * 0.8),
    });
  } catch (err) {
    console.error("Popup error:", err);
  }
});

// Handler pesan dengan validasi
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const allowedActions = ["findTables", "getTableData"];
  if (!allowedActions.includes(request.action)) {
    sendResponse({ error: "Action not allowed" });
    return;
  }
  console.log("Safe request:", request);
  return true; // Untuk async response
});