import React, { useState } from 'react';

function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {

        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div>
            <h2>Login</h2>
            <input 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <br />
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
