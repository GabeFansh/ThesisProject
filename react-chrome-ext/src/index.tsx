import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StartButton from './components/startButton';
import './App.css';
import LoginContainer from './components/loginContainer';
import Website from './components/website';
import SitesList from './components/sitesList';
import SitesList2 from './components/sitesList2';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <App />
    <StartButton />
    <LoginContainer />
    <Website />
    <SitesList />
  </React.StrictMode>
);