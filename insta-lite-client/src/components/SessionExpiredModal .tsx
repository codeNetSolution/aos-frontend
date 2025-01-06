import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setIsOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleSessionExpired = () => setIsOpen(true);

        window.addEventListener('sessionExpired', handleSessionExpired);

        return () => {
            window.removeEventListener('sessionExpired', handleSessionExpired);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Session expirée</h2>
                <p className="text-gray-700 mb-4">Votre session a expiré. Veuillez vous reconnecter pour continuer.</p>
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Reconnexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
