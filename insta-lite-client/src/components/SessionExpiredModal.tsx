import React from 'react';

interface SessionExpiredModalProps {
    onLogout: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ onLogout }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-lg font-bold mb-4">Session Expirée</h2>
                <p>Votre session a expiré. Veuillez vous reconnecter pour continuer.</p>
                <button
                    onClick={onLogout}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Reconnecter
                </button>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
