import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiClient';
import '../styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        orgCode: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.signup(
                formData.name,
                formData.email,
                formData.password,
                formData.orgCode
            );

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <button className="back-button" onClick={handleBack}>
                    ← Retour
                </button>

                <h1>Créer un compte</h1>

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Nom</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nom complet"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Code organisation</label>
                        <input
                            type="text"
                            name="orgCode"
                            placeholder="Ex: TECH2025"
                            value={formData.orgCode}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading ? 'Création...' : 'Créer un compte'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;