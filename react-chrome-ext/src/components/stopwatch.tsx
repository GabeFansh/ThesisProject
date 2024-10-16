
import React, { useState, useEffect } from 'react';



function Stopwatch() {

  const [time, setTime] = useState(0);
  const [loggedin, setLoggedIn] = useState(false);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isActive, time]);

  useEffect(() => {
    chrome.storage.local.get(['isLoggedIn'], (result) => {
      if (result.isLoggedIn) {
        setLoggedIn(true);
      }
    });
  }, []);

  const handleStartStop = () => {
    if (!isActive) {
      setTime(0);
    }
    setIsActive(!isActive);
  };

  return (
    <div>
      <div>{time}s</div>
      {loggedin && (
        <button onClick={handleStartStop}>
          {isActive ? 'Stop' : 'Start'}
        </button>
      )}
    </div>
  );
}

export default Stopwatch;
