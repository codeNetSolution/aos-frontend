import React from 'react';

interface ModalProps {
    children: React.ReactNode; // Propriété children pour afficher du contenu dans la modal
    onClose: () => void; // Fonction pour fermer la modal
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                {/* Bouton pour fermer la modal */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                {children} {/* Affichage du contenu passé dans children */}
            </div>
        </div>
    );
};

export default Modal;
