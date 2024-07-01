import React, { useState } from 'react';

function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {

        console.log('Username:', username);
        console.log('Password:', password);

        try {
            const response = await fetch('/public/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const token = response.headers.get('Authorization'); 

            if (token) {
                sessionStorage.setItem('jwtToken', token);
                const userData = await response.json();
                console.log('Login successful:', userData);
            } else {
                throw new Error('Token not found in response headers');
            }

        } catch (error) {
            setError(error.message);
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
