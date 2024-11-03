import React, { useState, useEffect } from 'react';

const SitesList: React.FC = () => {
    const [url, setUrl] = useState('');
    const [urls, setUrls] = useState<string[]>([]);
    const [currentDomain, setCurrentDomain] = useState('');

    useEffect(() => {
        // Load URLs from chrome.storage
        chrome.storage.local.get(['domains'], (result) => {
            if (result.domains) {
                setUrls(result.domains);
            }
        });

        // Get the current tab's domain
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                const url = new URL(tabs[0].url);
                setCurrentDomain(url.hostname);
            }
        });
    }, []);

    const addUrl = () => {
        try {
            // Validate URL
            new URL(url);
            const newUrls = [...urls, url];
            setUrls(newUrls);
            chrome.storage.local.set({ domains: newUrls });
            setUrl('');
        } catch (e) {
            alert('Please enter a valid URL.');
        }
    };

    const clearUrls = () => {
        setUrls([]);
        chrome.storage.local.set({ domains: [] });
    };

    return (
        <div className='sites-list-container'>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={addUrl}>Add URL</button>
            <button onClick={clearUrls}>Clear URLs</button>
            <ul className='sites-list'>
                {urls.map((storedUrl, index) => {
                    const domain = new URL(storedUrl).hostname;
                    return (
                        <li key={index} style={{ color: domain === currentDomain ? 'red' : 'black' }}>
                            {storedUrl}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SitesList;
