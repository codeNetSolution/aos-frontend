import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, onLogout}) => {

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
                            <Link
                                to="/portfolio/private"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                            >
                                Portfolio privé
                            </Link>
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
                                Management ADMIN
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
                                Connexion
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                            >
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
