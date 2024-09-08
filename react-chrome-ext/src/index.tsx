import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StartButton from './components/startButton'; // Correctly import the 'startButton' component
import './App.css';
import LoginContainer from './components/loginContainer';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <App />
    <StartButton />
    <LoginContainer />
  </React.StrictMode>
);