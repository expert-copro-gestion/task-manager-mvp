import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileSelection.css';

const ProfileSelection = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockProfiles = [
            {
                id: 1,
                name: 'Sophie Martin',
                email: 'sophie@techcorp.fr',
                initials: 'SM',
            },
            {
                id: 2,
                name: 'Thomas Dubois',
                email: 'thomas@techcorp.fr',
                initials: 'TD',
            },
            {
                id: 3,
                name: 'Marie Leroy',
                email: 'marie@techcorp.fr',
                initials: 'ML',
            },
        ];

        setProfiles(mockProfiles);
        setLoading(false);
    }, []);

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
                <h1>Sélectionner un profil</h1>
                <p>Ou créer un nouveau profil</p>
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