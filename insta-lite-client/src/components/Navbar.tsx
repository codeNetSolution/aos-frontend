import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar: React.FC = () => {
    const { isAuthenticated, role, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link to="/" className="text-primary font-bold text-2xl">
                    Insta-lite
                </Link>
                <div className="flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="text-dark hover:underline">
                                Profil
                            </Link>
                            {role === 'ROLE_USER' && (
                                <Link
                                    to="/portfolio/private"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                                >
                                    Portfolio privé
                                </Link>
                            )}
                            {role === 'ROLE_ADMIN' && (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                                    >
                                        Dashboard Admin
                                    </Link>
                                    <Link
                                        to="/admin/management"
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                                    >
                                        Management Admin
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                                Connexion
                            </Link>
                            <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
