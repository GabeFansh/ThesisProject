import React, { useState, useEffect, useRef } from 'react';

const PointsTracker: React.FC = () => {
    const [points, setPoints] = useState(0);
    const [isStopwatchActive, setIsStopwatchActive] = useState(false);
    const [currentDomain, setCurrentDomain] = useState('');
    const [trackedDomains, setTrackedDomains] = useState<string[]>([]);
    const pointsIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Load points from storage on initialization
        chrome.storage.local.get(['points'], (result) => {
            setPoints(result.points || 0);
        });

        // Listen for points changes from chrome.storage
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.points) {
                setPoints(changes.points.newValue || 0);
            }
        });

        // Check if the stopwatch is active
        const checkStopwatchStatus = () => {
            chrome.runtime.sendMessage({ command: 'getTime' }, (response) => {
                if (response) {
                    setIsStopwatchActive(response.isActive);
                }
            });
        };

        checkStopwatchStatus();

        // Listen for updates to the stopwatch status
        const handleMessage = (message: { command: string, isActive?: boolean, time?: number }) => {
            if (message.command === 'updateStatus') {
                setIsStopwatchActive(message.isActive ?? isStopwatchActive);
            }
            if (message.command === 'updateTime' && message.time !== undefined) {
                setPoints(message.time);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        // Load tracked domains from chrome.storage
        chrome.storage.local.get(['domains'], (result) => {
            if (result.domains) {
                // Extract hostnames from full URLs
                const domainList = result.domains.map((url: string) => {
                    try {
                        return new URL(url).hostname;
                    } catch {
                        return null;
                    }
                }).filter(Boolean) as string[];

                setTrackedDomains(domainList);
            }
        });

        // Get the current tab's domain
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                const url = new URL(tabs[0].url);
                setCurrentDomain(url.hostname);
            }
        });

        // Periodically refresh stopwatch status to keep up-to-date
        const interval = setInterval(checkStopwatchStatus, 1000);

        // Cleanup listener and interval on unmount
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        console.log('Current domain:', currentDomain);
        console.log('Tracked domains:', trackedDomains);
        console.log('Is stopwatch active:', isStopwatchActive);

        if (isStopwatchActive && trackedDomains.includes(currentDomain)) {
            console.log('Starting points interval...');
            if (!pointsIntervalRef.current) {
                pointsIntervalRef.current = setInterval(() => {
                    chrome.runtime.sendMessage({ command: 'incrementPoints' });
                }, 1000);
            }
        } else {
            if (pointsIntervalRef.current) {
                console.log('Stopping points interval...');
                clearInterval(pointsIntervalRef.current);
                pointsIntervalRef.current = null;
            }
        }

        return () => {
            if (pointsIntervalRef.current) {
                clearInterval(pointsIntervalRef.current);
                pointsIntervalRef.current = null;
            }
        };
    }, [isStopwatchActive, currentDomain, trackedDomains]);

    return (
        <div className='points-tracker-container'>
            <h2>Points Tracker</h2>
            <p>Current Points: {points}</p>
            <p>Tracking: {isStopwatchActive ? 'Active' : 'Inactive'}</p>
        </div>
    );
};

export default PointsTracker;
