import React, { useState, useEffect } from 'react';

const LoginContainer: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);

        chrome.storage.local.set({ isLoggedIn: true, username }, () => {
            setIsLoggedIn(true);
            window.location.reload(); 
        });
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');

        chrome.storage.local.remove(['isLoggedIn', 'username'], () => {
            console.log('Chrome storage cleared.');
            window.location.reload(); 
        });

        chrome.storage.local.remove(['domains'], () => {
            console.log('Sites list cleared from storage.');
        });
    };

    useEffect(() => {
        chrome.storage.local.get(['isLoggedIn', 'username'], (result) => {
            if (result.isLoggedIn) {
                setIsLoggedIn(true);
                setUsername(result.username || ''); 
            }
        });
    }, []);

    if (isLoggedIn) {
        return (
            <div>
                <h2>Welcome, {username}!</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginContainer;
