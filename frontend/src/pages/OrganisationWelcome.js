import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrganisationWelcome.css';


const USER_SERVICE = process.env.REACT_APP_USER_SERVICE;

const OrganisationWelcome = () => {
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!searchValue.trim()) {
            setError('Veuillez entrer un nom ou code organisation');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${USER_SERVICE}/users/organizations/${searchValue.trim()}`);
            if (response.data && response.data.id) {
                localStorage.setItem('orgId', response.data.id);
                localStorage.setItem('orgName', response.data.name);
                localStorage.setItem('orgCode', response.data.code);
                navigate('/profiles');
            }
        } catch (err) {
            setError('Organisation introuvable. Vérifiez le nom ou le code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <div className="welcome-logo">
                    <img src="/logo.png" alt="Logo" className="welcome-logo-img" />
                </div>
                <h1 className="welcome-title">Gestionnaire de Tâches</h1>
                <p className="welcome-subtitle">
                    Organisez, assignez et suivez les tâches de votre équipe en temps réel.
                </p>
                <div className="welcome-features">
                    <div className="feature-item">✅ Assignation de tâches</div>
                    <div className="feature-item">👥 Travail en équipe</div>
                    <div className="feature-item">📊 Suivi en temps réel</div>
                </div>
                <div className="welcome-form">
                    <p className="welcome-form-label">Entrez le nom ou le code de votre organisation</p>
                    <input
                        type="text"
                        placeholder="Ex: AUBRY-GESTION ou AUBRY2025"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        className="welcome-input"
                    />
                    {error && <p className="welcome-error">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="welcome-button"
                    >
                        {loading ? 'Recherche...' : 'Accéder →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganisationWelcome;