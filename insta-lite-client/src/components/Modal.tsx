import React, { useState } from 'react';
import { User } from '../types/user';
import bcrypt from 'bcryptjs';

interface ModalProps {
    isEditMode: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (user: User) => void;
}

const Modal: React.FC<ModalProps> = ({ isEditMode, user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<User>(
        user || {
            email: '',
            password: '',
            username: '',
            role: 'Utilisateur',
            profilePic: '',
        }
    );
    const [changePassword, setChangePassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = { ...formData };

        // Chiffrement du mot de passe si nécessaire
        if (!isEditMode || (isEditMode && changePassword)) {
            const salt = await bcrypt.genSalt(10); // Génère un sel
            updatedData.password = await bcrypt.hash(updatedData.password, salt); // Chiffre le mot de passe
        }

        onSubmit(updatedData);
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
                        <input
                            type="text"
                            name="profilePic"
                            placeholder="Photo de profil (URL)"
                            value={formData.profilePic}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        >
                            <option value="Utilisateur">Utilisateur</option>
                            <option value="Administrateur">Administrateur</option>
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
