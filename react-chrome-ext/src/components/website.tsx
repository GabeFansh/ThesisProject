import React, { useEffect, useState } from 'react';

const Website: React.FC = () => {
    const [currentWebsite, setCurrentWebsite] = useState('');

    useEffect(() => {
        const getCurrentTab = () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const tab = tabs[0];
                    const url = new URL(tab.url || '');
                    setCurrentWebsite(url.hostname);
                }
            });
        };

        getCurrentTab();
        
    }, []); 
    return (
        <div>
            <h1>Current Website:</h1>
            <p>{currentWebsite}</p>
        </div>
    );
};

export default Website;
