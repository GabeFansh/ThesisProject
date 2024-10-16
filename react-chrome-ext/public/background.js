let time = 0;
let isActive = false;
let interval = null;

// Save the time and state to Chrome's local storage
function saveTime() {
  chrome.storage.local.set({ savedTime: time, isActive });
}

// Start the stopwatch, resetting the time
const startStopwatch = () => {
  time = 0;  // Reset time when starting
  isActive = true;
  clearInterval(interval);  // Clear any previous intervals
  interval = setInterval(() => {
    time += 1;
    saveTime();  // Continuously save time to storage
  }, 1000);
};

// Continue stopwatch without resetting time
const continueStopwatch = () => {
  if (!isActive) {
    isActive = true;
    interval = setInterval(() => {
      time += 1;
      saveTime();
    }, 1000);
  }
};

// Stop the stopwatch
const stopStopwatch = () => {
  isActive = false;
  clearInterval(interval);
  saveTime();
};

// Listen for messages from the popup (React component)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'start') {
    startStopwatch();
    sendResponse({ success: true });
  } else if (message.command === 'continue') {
    continueStopwatch();
    sendResponse({ success: true });
  } else if (message.command === 'stop') {
    stopStopwatch();
    sendResponse({ success: true });
  } else if (message.command === 'getTime') {
    sendResponse({ time, isActive });
  }
  return true;
});

// Save the state when the extension is suspended (optional)
chrome.runtime.onSuspend.addListener(() => {
  saveTime();
});
