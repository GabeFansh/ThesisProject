import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('Loading...');

  useEffect(() => {
    // Simulate fetching data by directly assigning a value after a short delay
    setTimeout(() => {
      const mockData = {
        message: 'Welcome to Study Safari! Enjoy your stay!'
      };
      setData(mockData.message); // Directly set the local data
    }, 1000); // Delay for simulation purposes (1 second)
  }, []);

  // Log data to console whenever it changes
  useEffect(() => {
    console.log(data);
  }, [data]); // This effect runs whenever 'data' changes

  return (
    <div className="App">
      <h1>Study Safari</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
