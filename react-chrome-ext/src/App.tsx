import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('Loading...');

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((result) => {
        setData(result.message); // Access the 'message' field in the JSON response
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData('Error loading data');
      });
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
