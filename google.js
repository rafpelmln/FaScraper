// Versi modern Google Analytics untuk ekstensi Chrome
const GA_TRACKING_ID = 'UA-45974197-11';

// Simulasi _gaq untuk kompatibilitas dengan kode lama
window._gaq = window._gaq || [];
window._gaq.push = function(args) {
  if (!args) return;
  
  // Handle different GA command formats
  if (args[0] === '_setAccount' && args[1] === GA_TRACKING_ID) {
    return;
  }
  
  if (args[0] === '_trackPageview') {
    sendGAData('pageview');
    return;
  }
  
  if (Array.isArray(args) && args.length === 4 && args[0] === '_trackEvent') {
    sendGAData('event', {
      eventCategory: args[1],
      eventAction: args[2],
      eventLabel: args[3],
      eventValue: 1
    });
  }
};

// Fungsi untuk mengirim data ke Google Analytics
function sendGAData(type, params = {}) {
  const payload = new URLSearchParams();
  payload.append('v', '1');
  payload.append('tid', GA_TRACKING_ID);
  payload.append('cid', getClientId());
  payload.append('t', type);
  
  for (const [key, value] of Object.entries(params)) {
    payload.append(key, value);
  }
  
  // Menggunakan fetch dengan error handling
  fetch(`https://www.google-analytics.com/collect`, {
    method: 'POST',
    body: payload,
    keepalive: true
  }).catch(() => {});
}

// Generate client ID yang persisten
function getClientId() {
  const storageKey = 'ga_client_id';
  let clientId = localStorage.getItem(storageKey);
  
  if (!clientId) {
    clientId = `${Math.random().toString(36).substring(2, 15)}.${Math.floor(Date.now() / 1000)}`;
    localStorage.setItem(storageKey, clientId);
  }
  
  return clientId;
}

// Inisialisasi
window._gaq.push(['_setAccount', GA_TRACKING_ID]);
window._gaq.push(['_trackPageview']);