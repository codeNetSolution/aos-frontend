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
    const [geoLocationError, setGeoLocationError] = useState<string | null>(null);

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

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setNewPost({ ...newPost, location: `Lat: ${latitude}, Lng: ${longitude}` });
                    setGeoLocationError(null);
                },
                (error) => {
                    setGeoLocationError('Impossible d’obtenir votre position. Veuillez autoriser la géolocalisation.');
                }
            );
        } else {
            setGeoLocationError('La géolocalisation n’est pas prise en charge par votre navigateur.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
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
                        <label className="block mb-2 text-sm font-medium text-gray-600">Adresse</label>
                        <input
                            type="text"
                            placeholder="Saisissez l’adresse"
                            value={newPost.location}
                            onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Utiliser ma position actuelle
                        </button>
                        {geoLocationError && <p className="text-red-500 text-sm mt-2">{geoLocationError}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Visibilité</label>
                        <select
                            value={newPost.visibility}
                            onChange={(e) => setNewPost({ ...newPost, visibility: e.target.value as 'Public' | 'Private' })}
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
