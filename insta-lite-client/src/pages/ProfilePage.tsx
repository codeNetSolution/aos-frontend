import React, { useEffect, useState } from 'react';
import { getProfile, getProfilePicture, updateUser } from '../utils/api';
import { User } from '../types/user';
import { toast } from 'react-toastify';
import imageProfil from '../../public/icon_profile.png';

const ProfilePage = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getProfile();
                setProfile(userData);
                if (userData.id) {
                    const imageUrl = await getProfilePicture(userData.id);
                    setImagePreview(imageUrl);
                }
            } catch (err) {
                toast.error('❌ Erreur lors de la récupération du profil.', { position: 'top-right', theme: 'colored' });
                setError("Impossible de récupérer le profil de l'utilisateur.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, []);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            toast.error("❌ Veuillez sélectionner une image valide.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("❌ La taille de l'image ne doit pas dépasser 5 Mo.");
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }
};


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;

        const form = new FormData();
        
        const emailInput = (document.getElementById('email') as HTMLInputElement).value;
        const usernameInput = (document.getElementById('username') as HTMLInputElement).value;
        const passwordInput = (document.getElementById('password') as HTMLInputElement).value;

        if (!emailInput || !usernameInput) {
            toast.warn("⚠️ Le nom et l'email sont obligatoires.", { position: 'top-right', theme: 'colored' });
            return;
        }

        form.append('email', emailInput);
        form.append('username', usernameInput);
        if (passwordInput) {
            if (passwordInput.length < 8) {
                toast.warn('⚠️ Le mot de passe doit contenir au moins 8 caractères.', { position: 'top-right', theme: 'colored' });
                return;
            }
            form.append('password', passwordInput);
        }
        if (selectedFile) {
            form.append('profilePic', selectedFile);
        }

        try {
            await updateUser(profile.id, form);
            const updatedProfile = await getProfile();
            setProfile(updatedProfile);
            if (updatedProfile.profilePic) {
                const newImageUrl = await getProfilePicture(updatedProfile.id);
                setImagePreview(newImageUrl);
            }
            setSelectedFile(null);
            (document.getElementById('password') as HTMLInputElement).value = '';
            toast.success('✅ Profil mis à jour avec succès !', { position: 'top-right', theme: 'colored' });
        } catch (err) {
            toast.error('❌ Erreur lors de la mise à jour du profil.', { position: 'top-right', theme: 'colored' });
            setError('Une erreur est survenue lors de la mise à jour du profil.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light bg-gray-100 pt-16">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-dark text-center mb-6">Mon Profil</h2>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <div className="mb-6 text-center">
                    <img
                        src={imagePreview || imageProfil}
                        alt="Photo de profil"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="username">
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            id="username"
                            defaultValue={profile?.username}
                            className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            defaultValue={profile?.email}
                            className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Laissez vide pour ne pas changer"
                            className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="profilePic">
                            Photo de profil
                        </label>
                        <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 mt-6 bg-primary text-white rounded-lg hover:bg-opacity-90 shadow-lg focus:outline-none"
                    >
                        Mettre à jour le profil
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;