import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import StartButton from './components/startButton';
import './App.css';
import Website from './components/website';
import SitesList from './components/sitesList';
import Stopwatch from './components/stopwatch';
import PointsTracker from './components/pointsTracking';
import AnimalRedeemer from './components/animals';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <App />
    <Stopwatch />
    <PointsTracker />
    <AnimalRedeemer />
    <Website />
    <SitesList />
  </React.StrictMode>
);