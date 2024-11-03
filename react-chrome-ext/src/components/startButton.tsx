import { useState } from 'react';
import Stopwatch from './stopwatch'; // Ensure Stopwatch is properly imported

declare const chrome: any;

function StartButton() {
  const [data, setData] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    //reload extension window when start button is clicked
      if (isVisible) {
      chrome.runtime.sendMessage({ command: 'stop' });
      setIsVisible(false);
      setData(null);
    } else {
      chrome.runtime.sendMessage({ command: 'start' });
      setData('Operation started successfully');
      setIsVisible(true);
    }
  };

  return (
    <div className="startButton">
      <button onClick={handleClick}>Start</button>
      {isVisible && (
        <div>
          <div>{data}</div>
          <Stopwatch />
        </div>
      )}
    </div>
  );
}

export default StartButton;
