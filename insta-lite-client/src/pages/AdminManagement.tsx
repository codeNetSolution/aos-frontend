import { useEffect, useState } from 'react';
import { getUsers, registerUser, getProfilePicture, updateUser, deleteUser } from '../utils/api';
import { User } from '../types/user';
import Modal from '../components/ModalEditUser';
import { toast } from 'react-toastify';
import imageProfil from '../../public/icon_profile.png';

const AdminManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [profilePics, setProfilePics] = useState<{ [key: string]: string }>({});

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            console.log('Données récupérées:', data);
            setUsers(data);

            const newProfilePics: { [key: string]: string } = {};
            await Promise.all(
                data.map(async (user) => {
                    if (user.id) {
                        try {
                            const imageUrl = await getProfilePicture(user.id);
                            newProfilePics[user.id] = imageUrl;
                        } catch {
                            newProfilePics[user.id] = imageProfil; // Use fallback if fetching fails
                        }
                    }
                })
            );
            setProfilePics(newProfilePics);
        } catch {
            toast.error("Erreur lors de la récupération des utilisateurs.", { position: 'top-right', theme: 'colored' });
            setError("Une erreur s'est produite lors de la récupération des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (formData: FormData) => {
        try {
            await registerUser({
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                username: formData.get('username') as string,
                profilePic: formData.get('profilePic') as File,
            });
            fetchUsers();
            setIsModalOpen(false);
            toast.success('Utilisateur ajouté avec succès !', { position: 'top-right', theme: 'colored' });
        } catch {
            setError("Erreur lors de l'ajout de l'utilisateur.");
            toast.error("Impossible d'ajouter l'utilisateur.", { position: 'top-right', theme: 'colored' });
        }
    };

    const handleUpdateUser = async (id: number, formData: FormData) => {
        try {
            await updateUser(id, formData);
            fetchUsers();
            setIsModalOpen(false);
            toast.info('Utilisateur mis à jour avec succès !', { position: 'top-right', theme: 'colored' });
        } catch {
            toast.error("Impossible de mettre à jour l'utilisateur.", { position: 'top-right', theme: 'colored' });
            setError("Erreur lors de la mise à jour de l'utilisateur.");
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            fetchUsers();
            toast.success('Utilisateur supprimé avec succès !', { position: 'top-right', theme: 'colored' });
        } catch {
            toast.error("Impossible de supprimer l'utilisateur.", { position: 'top-right', theme: 'colored' });
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

    return (
        <div className="min-h-screen bg-light min-h-screen bg-gray-100 pt-16">
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
                                                src={profilePics[user.id as string] || imageProfil}
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
                        onSubmit={(formData) => {
                            if (isEditMode && selectedUser?.id) {
                                handleUpdateUser(selectedUser.id, formData);
                            } else {
                                handleAddUser(formData);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminManagement;
