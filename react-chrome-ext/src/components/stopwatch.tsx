import { useState, useEffect } from 'react';

declare const chrome: any;

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [highestTime, setHighestTime] = useState(() => {
    return parseInt(localStorage.getItem('highestTime') || '0', 10);
  });

  useEffect(() => {
    // Get the initial time and active state from the background script
    chrome.runtime.sendMessage({ command: 'getTime' }, (response: { time: number, isActive: boolean }) => {
      if (response) {
        setTime(response.time);
        setIsActive(response.isActive);
      }
    });

    // Listen for real-time updates from the background script
    const handleMessage = (message: { command: string, time?: number, isActive?: boolean }) => {
      if (message.command === 'updateTime' && message.time !== undefined) {
        setTime(message.time);
        if (message.isActive !== undefined) {
          setIsActive(message.isActive);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem('time', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const handleStartStop = () => {
    if (isActive) {
      chrome.runtime.sendMessage({ command: 'stop' });
      setIsActive(false);
      // Update the highest time when the stopwatch is stopped
      if (time > highestTime) {
        setHighestTime(time);
        localStorage.setItem('highestTime', time.toString());
      }
    } else {
      setTime(0); // Reset time when starting again
      localStorage.setItem('time', '0');
      chrome.runtime.sendMessage({ command: 'start' });
      setIsActive(true);
    }
  };

  return (
    <div className='stopwatchContainer'>
      <p className='stopwatch-time'>Current Time: {time}s</p>
      <p className='stopwatch-highest'>Highest Time: {highestTime}s</p>
      <button className='stopwatch-button' onClick={handleStartStop}>
        {isActive ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default Stopwatch;