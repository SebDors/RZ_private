import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Auth/Register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement registration logic
        console.log('Name:', name, 'Email:', email, 'Password:', password);
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>
            <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                />
            </div>
            <button type="submit" className="register-button">Register</button>
            <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </form>
    );
}

export default Register;
