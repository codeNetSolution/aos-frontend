import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    newPost: Partial<PortfolioItem>;
    setNewPost: React.Dispatch<React.SetStateAction<Partial<PortfolioItem>>>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, newPost, setNewPost }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setNewPost({ ...newPost, imageUrl: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'Public' | 'Private';
        setNewPost({ ...newPost, visibility: value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Créer un Nouveau Post</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Titre</label>
                        <input
                            type="text"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Description</label>
                        <textarea
                            value={newPost.description}
                            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Télécharger une image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Aperçu"
                                className="mt-4 w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Localisation</label>
                        <input
                            type="text"
                            value={newPost.location}
                            onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Visibilité</label>
                        <select
                            value={newPost.visibility}
                            onChange={handleVisibilityChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Privé</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-lg"
                        >
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
