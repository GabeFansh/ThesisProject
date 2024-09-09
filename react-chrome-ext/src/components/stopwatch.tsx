import React, { useState, useEffect } from 'react';

const Stopwatch: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [longestTime, setLongestTime] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['isLoggedIn'], (result) => {
            if (result.isLoggedIn) {
                setIsLoggedIn(true);
            }
        });
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(timer);
            if (time > longestTime) {
                setLongestTime(time);
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, time]);

    const handleStart = () => {
        setTime(0);
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleResetLongestTime = () => {
        setLongestTime(0);
    };

    if (!isLoggedIn) {
        return <div>Please log in to use the stopwatch.</div>;
    }

    return (
        <div>
            <h1>Stopwatch</h1>
            <p>{time}s</p>
            <p>Longest Time: {longestTime}s</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleResetLongestTime}>Reset Longest Time</button>
        </div>
    );
};

export default Stopwatch;