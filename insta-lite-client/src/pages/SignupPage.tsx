import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !username) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setIsLoading(true);
            await registerUser({ email, password, username });
            setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            console.error(err);
            setError('Une erreur est survenue. Veuillez vérifier vos informations.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <img src='/logo.svg'></img>
                <h1 className="text-4xl font-bold text-center text-primary mb-6">Rejoignez Insta-Lite</h1>
                <p className="text-gray-500 text-center mb-4">
                    Créez un compte pour partager et explorer des contenus exclusifs.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <div>
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Adresse email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 text-white rounded-lg shadow-md ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
                        }`}
                    >
                        {isLoading ? 'Chargement...' : 'Créer un compte'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Connectez-vous
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
