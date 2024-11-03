let time = 0;
let isActive = false;
let interval = null;
let points = 0;
let trackedDomains = [];

// Load initial points and tracked domains from chrome.storage when the extension starts
chrome.storage.local.get(['points', 'domains'], (result) => {
  points = result.points || 0;
  if (result.domains) {
    trackedDomains = result.domains.map((url) => {
      try {
        return new URL(url).hostname;
      } catch {
        return null;
      }
    }).filter(Boolean); // Ensure only valid hostnames are stored
  }
});

// Update tracked domains when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.domains) {
    trackedDomains = changes.domains.newValue.map((url) => {
      try {
        return new URL(url).hostname;
      } catch {
        return null;
      }
    }).filter(Boolean);
  }
  if (changes.points) {
    points = changes.points.newValue;
  }
});

function saveTimeAndPoints() {
  chrome.storage.local.set({ savedTime: time, isActive, points });
}

function startStopwatch() {
  if (!isActive) {
    isActive = true;
    interval = setInterval(() => {
      time += 1;
      checkAndIncrementPoints();
      saveTimeAndPoints();
    }, 1000);
  }
}

function stopStopwatch() {
  isActive = false;
  clearInterval(interval);
  saveTimeAndPoints();
}

function checkAndIncrementPoints() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      const currentDomain = new URL(tabs[0].url).hostname;
      if (trackedDomains.includes(currentDomain)) {
        points += 1;
        chrome.storage.local.set({ points }); // Persist points in storage
      }
    }
  });
}

// Listen for messages from the React component
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'start') {
    startStopwatch();
    sendResponse({ success: true });
  } else if (message.command === 'stop') {
    stopStopwatch();
    sendResponse({ success: true });
  } else if (message.command === 'getTime') {
    chrome.storage.local.get(['savedTime', 'isActive', 'points'], (result) => {
      sendResponse({ 
        time: result.savedTime || 0, 
        isActive: result.isActive || false, 
        points: result.points || 0 
      });
    });
    return true; // Keep the message channel open for async response
  }
});
