import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiClient';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const selectedProfile = JSON.parse(localStorage.getItem('selectedProfile'));

    if (!selectedProfile) {
        navigate('/');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(selectedProfile.email, password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        localStorage.removeItem('selectedProfile');
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <button className="back-button" onClick={handleBack}>← Retour</button>
                <div className="login-avatar">{selectedProfile.initials}</div>
                <div className="login-email">{selectedProfile.email}</div>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;