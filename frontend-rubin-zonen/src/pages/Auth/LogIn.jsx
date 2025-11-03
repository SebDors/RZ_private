import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Auth/LogIn.css';
import { loginUser } from '../../services/api';

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrorFields([]);

        try {
            const data = await loginUser(email, password);

            if (data.token) {
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
                if (data.message === 'User not found' || data.message === 'Invalid credentials') {
                    setErrorFields(['email', 'password']);
                }
            }
        } catch (err) {
            setError('An error occurred during login.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={errorFields.includes('email') ? 'error' : ''}
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={errorFields.includes('password') ? 'error' : ''}
                />
            </div>
            <div className="remember-me">
                <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="login-button">Login</button>
            <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </form>
    );
}

export default LogIn;