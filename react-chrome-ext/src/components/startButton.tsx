import { useState } from 'react';

function StartButton() {
  const [data, setData] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    if (isVisible) {
      setIsVisible(false);
      setData(null);
    } else {
      chrome.storage.local.get(['username'], (result) => {
        console.log('Username:', result.username);
        if (result.username) {
          fetch("http://127.0.0.1:5000/start")
            .then((response) => response.json())
            .then((result) => {
              setData(result.message); 
              setIsVisible(true);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
              setData('Error loading data');
              setIsVisible(true);
            });
        } else {
          setData('Username not found');
          setIsVisible(true);
        }
      });
    }
  };

  return (
    <div className="startButton">
      <button onClick={handleClick}>Start</button>
      {isVisible && <div>{data}</div>}
    </div>
  );
}

export default StartButton;
