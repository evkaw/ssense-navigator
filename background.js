// SSENSE Navigator v4.0 - Background Service Worker
// Required for Manifest v3 Chrome Extensions

console.log('🔥 SSENSE Navigator v4.0 - Background Service Worker loaded');

// Installation and Update Handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('📦 Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    console.log('🎉 First time installation - setting up defaults');
    
    // Set default size preferences
    const defaultPreferences = {
      clothing: ['M', 'L'],
      shoes: ['10', '10.5', '11'],
      pants: ['32', '31', '33']
    };
    
    chrome.storage.sync.set({ 
      sizePreferences: defaultPreferences,
      version: '4.0'
    }, () => {
      console.log('✅ Default preferences set');
    });
    
  } else if (details.reason === 'update') {
    console.log('🔄 Extension updated to v4.0');
    
    // Migration logic for existing users
    chrome.storage.sync.get(['sizePreferences'], (result) => {
      if (!result.sizePreferences) {
        // User had old version without storage - set defaults
        const defaultPreferences = {
          clothing: ['M', 'L'],
          shoes: ['10', '10.5', '11'],
          pants: ['32', '31', '33']
        };
        
        chrome.storage.sync.set({ 
          sizePreferences: defaultPreferences,
          version: '4.0'
        });
      }
    });
  }
});

// Handle popup-to-content script communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Background received message:', request);
  
  if (request.type === 'GET_PREFERENCES') {
    // Forward preference requests
    chrome.storage.sync.get(['sizePreferences'], (result) => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'UPDATE_PREFERENCES') {
    // Forward preference updates to all SSENSE tabs
    chrome.tabs.query({ url: ['*://www.ssense.com/*/*', '*://ssense.com/*/*'] }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'PREFERENCES_UPDATED',
          preferences: request.preferences
        }).catch(() => {
          // Content script not available, ignore
        });
      });
    });
  }
});

// Tab activation handler
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && (tab.url.includes('ssense.com') && tab.url.includes('/product/'))) {
      console.log('🎯 SSENSE product page activated:', tab.url);
      // Extension is active on this page
    }
  });
});

// Storage change monitoring
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('📊 Storage changed:', changes);
    
    if (changes.sizePreferences) {
      console.log('🔄 Size preferences updated, notifying content scripts');
      
      // Notify all SSENSE tabs about preference changes
      chrome.tabs.query({ url: ['*://www.ssense.com/*/*', '*://ssense.com/*/*'] }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'PREFERENCES_UPDATED',
            preferences: changes.sizePreferences.newValue
          }).catch(() => {
            // Content script not available, ignore
          });
        });
      });
    }
  }
});

// Keep service worker alive with periodic ping
// Service workers terminate after ~30 seconds of inactivity
setInterval(() => {
  // Minimal activity to prevent termination during active usage
  chrome.storage.local.set({ lastPing: Date.now() });
}, 25000); // Every 25 seconds

// Error handling
chrome.runtime.onSuspend.addListener(() => {
  console.log('💤 Service worker suspending...');
});

// Debug info
console.log('🛠️ SSENSE Navigator Background Service Worker ready');
console.log('📋 Available commands: storage sync, tab communication, preference management');