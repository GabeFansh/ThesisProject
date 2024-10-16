import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StartButton from './components/startButton';
import './App.css';
import LoginContainer from './components/loginContainer';
import Website from './components/website';
import SitesList from './components/sitesList';
import Stopwatch from './components/stopwatch';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <App />
    <Stopwatch />
    <LoginContainer />
    <Website />
    <SitesList />
  </React.StrictMode>
);