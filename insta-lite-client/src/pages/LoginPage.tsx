import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagePhoneConnexion from '/phone_connexion.jpg';
import { loginUser } from '../utils/api'
import { useAuth } from '../contexts/AuthContext';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
          setError('Veuillez remplir tous les champs.');
          return;
        }
        try {
          setError('');
          setIsLoading(true);
          const token = await loginUser(email, password);
          login(token); 
          navigate('/portfolio/private');
        } catch (err: any) {
          setError('Identifiants incorrects ou problème de connexion');
        } finally {
          setIsLoading(false);
        }
      };
      

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl bg-white shadow-md rounded-lg overflow-hidden">
                
                <div className="hidden lg:flex flex-col items-center justify-center bg-gray-100 w-1/2 p-6">
                    <div className="relative w-72 h-96">
                        <img
                            src={imagePhoneConnexion} 
                            alt="Phone Mockup"
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
                        />
                    </div>
                </div>

                {/* Section droite : Formulaire */}
                <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-8 py-10 bg-white">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">Insta Lite</h1>
                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Log in
                        </button>
                    </form>
                    <div className="flex items-center justify-between w-full max-w-sm mt-6">
                        <span className="h-px bg-gray-300 flex-grow"></span>
                        <span className="mx-4 text-gray-400 text-sm">OR</span>
                        <span className="h-px bg-gray-300 flex-grow"></span>
                    </div>
                    <a href="/forgot-password" className="text-sm text-blue-500 mt-4 hover:underline">
                        Forgotten your password?
                    </a>

                    {/* Pied de page */}
                    <div className="flex flex-col items-center justify-center mt-8">
                        <p className="text-sm">
                            Don’t have an account?{' '}
                            <a href="/signup" className="text-blue-500 hover:underline">
                                Sign up
                            </a>
                        </p>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
