import { useState, useEffect } from 'react';

declare const chrome: any;



function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initially set to false

  useEffect(() => {
    chrome.storage.local.get(['isLoggedIn'], (result: StorageData) => {
      setIsLoggedIn(result.isLoggedIn === true); // Set isLoggedIn based on chrome.storage
    });
  }, []);

  const handleStartStop = () => {
    if (isActive) {
      chrome.runtime.sendMessage({ command: 'stop' });
    } else {
      chrome.runtime.sendMessage({ command: 'start' });
    }
    setIsActive(!isActive);
  };

  // Conditionally render the stopwatch component or a login message
  if (!isLoggedIn) {
    return <p>Please log in to use the stopwatch.</p>;
  }

  return (
    <div>
      <p>{time}s</p>
        <button onClick={handleStartStop}>
          {isActive ? 'Stop' : 'Start'}
        </button>
    </div>
  );
}

export default Stopwatch;
