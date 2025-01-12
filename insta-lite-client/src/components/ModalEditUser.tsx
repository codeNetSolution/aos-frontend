import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { toast } from 'react-toastify';
import { getProfilePicture } from '../utils/api';

interface ModalProps {
    isEditMode: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const Modal: React.FC<ModalProps> = ({ isEditMode, user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<User>(
        user ?? {
            email: '',
            password: '',
            username: '',
            profilePic: '',
        }
    );
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    useEffect(() => {
        if (isEditMode && user) {
            setFormData(user);
            if (user.profilePic) {
                getProfilePicture(user.id)
                    .then((url) => setImagePreview(url))
                    .catch(() => setImagePreview(null));
            }
        }
    }, [isEditMode, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('username', formData.username);
        if (selectedFile) {
            form.append('profilePic', selectedFile);
        } else if (formData.profilePic) {
            form.append('profilePic', formData.profilePic);
        }

        try {
            onSubmit(form);
            toast.success(`✅ Utilisateur ${isEditMode ? 'modifié' : 'ajouté'} avec succès !`, {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        } catch (err) {
            toast.error('❌ Une erreur est survenue lors de la soumission.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        }
    };

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">
                    {isEditMode ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Nom d'utilisateur"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    {!isEditMode && (
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Photo de profil
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                        {imagePreview && (
                            <div className="mt-4 cursor-pointer" onClick={openImageModal}>
                                <img
                                    src={imagePreview}
                                    alt="Aperçu"
                                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                />
                            </div>
                        )}
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
                            {isEditMode ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>

            {isImageModalOpen && imagePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
                    <div className="bg-white p-6 rounded-lg max-w-full max-h-full overflow-hidden">
                        <button
                            className="absolute top-2 right-2 text-white text-2xl"
                            onClick={closeImageModal}
                        >
                            &times;
                        </button>
                        <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
