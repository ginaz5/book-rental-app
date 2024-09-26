import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call the login API
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);

                onLoginSuccess(data.username); // Inform parent component about the successful login
                onClose(); // Close the modal
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Failed to login. Please try again later.');
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default LoginModal;