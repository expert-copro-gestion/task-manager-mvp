import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfileSelection.css';

const USER_SERVICE = process.env.REACT_APP_USER_SERVICE;

const ProfileSelection = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orgName, setOrgName] = useState('');

    useEffect(() => {
        const orgId = localStorage.getItem('orgId');
        const storedOrgName = localStorage.getItem('orgName');

        if (!orgId) {
            navigate('/');
            return;
        }

        setOrgName(storedOrgName || '');

        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${USER_SERVICE}/users?orgId=${orgId}`);
                const users = response.data.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                }));
                setProfiles(users);
            } catch (err) {
                console.error('Erreur chargement profils:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [navigate]);

    const handleProfileClick = (profile) => {
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        navigate('/login');
    };

    const handleCreateProfile = () => {
        navigate('/signup');
    };

    if (loading) {
        return <div className="profile-selection-container">Chargement...</div>;
    }

    return (
        <div className="profile-selection-container">
            <div className="profile-selection-header">
                <h1>{orgName}</h1>
                <p>Sélectionnez votre profil</p>
            </div>
            <div className="profiles-grid">
                {profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="profile-card"
                        onClick={() => handleProfileClick(profile)}
                    >
                        <div className="profile-avatar">{profile.initials}</div>
                        <div className="profile-name">{profile.name}</div>
                        <div className="profile-email">{profile.email}</div>
                    </div>
                ))}
                <div className="profile-card add-profile" onClick={handleCreateProfile}>
                    <div className="profile-avatar-add">+</div>
                    <div className="profile-name">Nouveau profil</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSelection;