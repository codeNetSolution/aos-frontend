import React, { useState, useEffect } from 'react';
import { Comment } from '../types/portfolio';
import { PortfolioItem } from '../types/portfolio';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getProfilePicture } from '../utils/api';
import imageProfil from '../../public/icon_profile.png';

interface CommentSectionProps {
    item: PortfolioItem;
    currentUser: string;
    isPremium: boolean;
    comments: Comment[];
    onAddComment: (text: string) => Promise<void>;
    onEditComment: (commentId: number, newText: string) => Promise<void>;
    onDeleteComment: (commentId: number) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    currentUser,
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
}) => {
    const { role } = useAuth();
    const isAdmin = role === 'ROLE_ADMIN';
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePics, setProfilePics] = useState<{ [key: number]: string }>({}); // Map by userId

    useEffect(() => {
        const fetchProfilePictures = async () => {
            const newProfilePics: { [key: number]: string } = { ...profilePics };

            for (const comment of comments) {
                if (comment.userId && !newProfilePics[comment.userId]) {
                    try {
                        const imageUrl = await getProfilePicture(comment.userId);
                        newProfilePics[comment.userId] = imageUrl;
                    } catch (error) {
                        console.error(`Error fetching profile picture for user ID: ${comment.userId}`, error);
                        newProfilePics[comment.userId] = imageProfil; // Default picture on error
                    }
                }
            }

            setProfilePics(newProfilePics);
        };

        fetchProfilePictures();
    }, [comments]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCommentText.trim()) {
            toast.warn('⚠️ Le commentaire ne peut pas être vide.', {
                position: 'top-right',
                theme: 'colored',
            });
            return;
        }

        try {
            await onAddComment(newCommentText);
            setNewCommentText('');
            toast.success('💬 Commentaire ajouté avec succès !', {
                position: 'top-right',
                theme: 'colored',
            });
        } catch (error) {
            toast.error("❌ Impossible d'ajouter le commentaire.", {
                position: 'top-right',
                theme: 'colored',
            });
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const recentComments = comments.slice(-2);

    const CommentItem = ({ comment }: { comment: Comment }) => (
        <div key={comment.id} className="mb-4 border-b pb-2">
            <div className="flex items-start space-x-3">
                <img
                    src={profilePics[comment.userId] || imageProfil}
                    alt={`${comment.author} profile`}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                    {editingCommentId === comment.id ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const newText = (e.target as HTMLFormElement).elements.namedItem(
                                    'editComment'
                                ) as HTMLInputElement;
                                onEditComment(comment.id, newText.value.trim());
                                setEditingCommentId(null);
                            }}
                        >
                            <input
                                type="text"
                                name="editComment"
                                defaultValue={comment.text}
                                className="w-full px-2 py-1 border rounded-lg focus:outline-none"
                            />
                            <div className="mt-2 flex space-x-2">
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-primary text-white rounded-lg"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-3 py-1 bg-gray-300 text-black rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600">
                                <strong>{comment.author}:</strong> {comment.text}
                            </p>
                            {(isAdmin || comment.author === currentUser) && (
                                <div className="mt-2">
                                    <button
                                        onClick={() => setEditingCommentId(comment.id)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => onDeleteComment(comment.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-4">
            <form onSubmit={handleAddComment} className="flex items-start space-x-3">
                <img
                    src={profilePics[currentUser] || imageProfil}
                    alt="Your profile"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Ajouter un commentaire"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg shadow-lg"
                    >
                        Ajouter
                    </button>
                </div>
            </form>

            <div className="mt-4">
                {recentComments.length > 0 ? (
                    recentComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    <p className="text-gray-500">Aucun commentaire pour le moment.</p>
                )}

                {comments.length > 2 && (
                    <button
                        onClick={handleOpenModal}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        Voir tous les commentaires
                    </button>
                )}
            </div>

            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <h2 className="text-lg font-bold mb-4">Tous les commentaires</h2>
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </Modal>
            )}
        </div>
    );
};

export default CommentSection;
