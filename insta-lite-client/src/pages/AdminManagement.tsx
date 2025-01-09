import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';
import { User } from '../types/user';
import Modal from '../components/ModalEditUser';

const AdminManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditMode, setIsEditMode] = useState(false); 

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            console.log('Données récupérées:', data);
            setUsers(data);
        } catch (err: any) {
            setError("Une erreur s'est produite lors de la récupération des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (user: User) => {
        try {
            const createdUser = await createUser(user);
            setUsers((prevUsers) => [...prevUsers, createdUser]);
            setIsModalOpen(false); 
        } catch (err: any) {
            setError("Erreur lors de l'ajout de l'utilisateur.");
        }
    };

    const handleUpdateUser = async (id: number, user: Partial<User>) => {
        try {
            const updatedUser = await updateUser(id, user);
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === id ? updatedUser : u))
            );
            setIsModalOpen(false); 
        } catch (err: any) {
           
            setError("Erreur lors de la mise à jour de l'utilisateur.");
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        } catch (err: any) {
            setError("Erreur lors de la suppression de l'utilisateur.");
        }
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-dark text-center mb-8">Gestion des Utilisateurs</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="flex justify-end mb-4">
                    <button
                        onClick={openAddModal}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                    >
                        Ajouter un utilisateur
                    </button>
                </div>

                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">Photo</th>
                                    <th className="px-4 py-2 text-left">Nom d'utilisateur</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Rôle</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2">
                                            <img
                                                src={user.profilePic || 'https://via.placeholder.com/50'}
                                                alt="Profil"
                                                className="w-12 h-12 rounded-full"
                                            />
                                        </td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.role}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Modifier
                                            </button>
                                            {' | '}
                                            <button
                                                onClick={() => handleDeleteUser(user.id!)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalOpen && (
                    <Modal
                    isEditMode={isEditMode}
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(user) => {
                        if (isEditMode && user.id) {
                            handleUpdateUser(user.id, user);
                            setUsers((prevUsers) =>
                                prevUsers.map((u) => (u.id === user.id ? user : u))
                            );
                        } 
                    }}
                />
                )}
            </div>
        </div>
    );
};

export default AdminManagement;
