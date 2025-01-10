import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';
import { Comment } from '../types/portfolio';
import Modal from './Modal';
interface CommentSectionProps {
    item: PortfolioItem;
    currentUser: string;
    isPremium: boolean;
    comments: Comment[]; 
    onAddComment: (text: string) => Promise<void>;
    onEditComment: (commentId: number, newText: string) => Promise<void>;
    onDeleteComment: (commentId: number) => Promise<void>; 
}
const CommentSection: React.FC<CommentSectionProps> = ({currentUser,
    isPremium,
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
 }) => {
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCommentText.trim()) {
            alert('Le commentaire ne peut pas être vide.');
            return;
        }

        try {
            await onAddComment(newCommentText);
            setNewCommentText(''); 
        } catch (error) {
            console.error('Erreur lors de l’ajout du commentaire :', error);
            alert('Impossible d’ajouter le commentaire.');
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const recentComments = comments.slice(-2);

    return (
        <div className="mt-4">
            {/* Formulaire pour ajouter un commentaire */}
            <form onSubmit={handleAddComment}>
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
            </form>

            {/* Liste des commentaires récents */}
            <div className="mt-4">
                {recentComments.length > 0 ? (
                    recentComments.map((comment) => (
                        <div key={comment.id} className="mb-4 border-b pb-2">
                            {editingCommentId === comment.id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const newText = (
                                            e.target as HTMLFormElement
                                        ).elements.namedItem('editComment') as HTMLInputElement;
                                        onEditComment(comment.id, newText.value.trim());
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
                                    {comment.author === currentUser && (
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

            {/* Modal pour afficher tous les commentaires */}
            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <h2 className="text-lg font-bold mb-4">Tous les commentaires</h2>
                    {comments.map((comment) => (
                        <div key={comment.id} className="mb-4 border-b pb-2">
                            <p>
                                <strong>{comment.author}:</strong> {comment.text}
                            </p>
                            {isPremium && comment.author === currentUser && (
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
                        </div>
                    ))}
                </Modal>
            )}
        </div>
    );
};

export default CommentSection;
