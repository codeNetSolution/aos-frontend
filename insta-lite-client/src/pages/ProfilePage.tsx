import React, { useState } from 'react';

const ProfilePage = () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '' || email.trim() === '') {
            setError('Le nom et l’email sont obligatoires.');
            return;
        }
        if (password && password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        setError('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-dark text-center">Mon Profil</h2>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">Profil mis à jour avec succès !</p>}
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="name">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
