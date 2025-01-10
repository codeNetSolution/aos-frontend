import React, { useState } from 'react';
import { User } from '../types/user';
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify';

interface ModalProps {
    isEditMode: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (user: User, file?: File) => void;
}

const Modal: React.FC<ModalProps> = ({ isEditMode, user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<User>(
        user ?? {  
            email: '',
            password: '',
            username: '',
            role: 'ROLE_USER', 
            profilePic: '',
        }
    );
    const [changePassword, setChangePassword] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        let mappedValue = value;
        if (name === 'role') {
            if (value === 'Utilisateur') {
                mappedValue = 'ROLE_USER';
            } else if (value === 'Administrateur') {
                mappedValue = 'ROLE_ADMIN';
            } else if (value === 'Premium') {
                mappedValue = 'ROLE_PREMIUM';
            }
        }
    
        setFormData({ ...formData, [name]: mappedValue });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = { ...formData };
    
        try {
            if (!isEditMode || (isEditMode && changePassword)) {
                const salt = await bcrypt.genSalt(10);
                updatedData.password = await bcrypt.hash(updatedData.password, salt);
            }
        
            if (selectedFile) {
                updatedData.profilePic = selectedFile.name;
            }
            onSubmit(updatedData, selectedFile || undefined);
            toast.success(`✅ Utilisateur ${isEditMode ? 'modifié' : 'ajouté'} avec succès !`, {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        } catch (err){
            toast.error('❌ Une erreur est survenue lors de la soumission.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        }
        

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
                    {isEditMode && (
                        <div className="mb-4">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={changePassword}
                                    onChange={() => setChangePassword(!changePassword)}
                                    className="mr-2"
                                />
                                Modifier le mot de passe
                            </label>
                        </div>
                    )}
                    {(changePassword || !isEditMode) && (
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                required={!isEditMode || changePassword}
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
                            <img
                                src={imagePreview}
                                alt="Aperçu"
                                className="mt-4 w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <select
                            name="role"
                            value={
                                formData.role === 'ROLE_USER'
                                    ? 'Utilisateur'
                                    : formData.role === 'ROLE_ADMIN'
                                    ? 'Administrateur'
                                    : 'Premium'
                            }
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        >
                            <option value="Utilisateur">Utilisateur</option>
                            <option value="Administrateur">Administrateur</option>
                            <option value="Premium">Premium</option>
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
                            {isEditMode ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
