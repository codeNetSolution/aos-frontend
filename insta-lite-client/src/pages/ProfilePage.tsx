import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../utils/api';
import { User } from '../types/user';

const ProfilePage = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getProfile();
                setProfile(userData);
            } catch (err) {
                console.error('Erreur lors de la récupération du profil :', err);
                setError("Impossible de récupérer le profil de l'utilisateur.");
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
    
        if (profile.username.trim() === '' || profile.email.trim() === '') {
            setError('Le nom et l’email sont obligatoires.');
            return;
        }
        if (password && password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
    
        try {
            setError('');
            const updatedProfile = { ...profile };
            
            
            if (password) {
                updatedProfile.password = password;
            }
    
            const updatedUser = await updateProfile(updatedProfile);
            setProfile(updatedUser); // Mettez à jour le profil localement
            setPassword(''); // Réinitialiser le champ mot de passe
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du profil :', err);
            setError('Une erreur est survenue lors de la mise à jour du profil.');
        }
    };
    

    if (!profile) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-dark text-center">Mon Profil</h2>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">Profil mis à jour avec succès !</p>}
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="name">
                            Username
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Laissez vide pour ne pas changer"
                            className="w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 shadow-lg focus:outline-none"
                    >
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
