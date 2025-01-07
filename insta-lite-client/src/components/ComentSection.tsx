import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';
import { addComment, updateComment, deleteComment } from '../utils/api';

interface CommentSectionProps {
    item: PortfolioItem;
    currentUser: string;
    refreshComments: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ item, currentUser, refreshComments }) => {
    const [editingComment, setEditingComment] = useState<number | null>(null);

    const handleAddComment = async (text: string) => {
        try {
            await addComment(item.id, text);
            refreshComments();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            alert('Impossible d\'ajouter le commentaire.');
        }
    };

    const handleEditComment = async (commentId: number, newText: string) => {
        try {
            await updateComment(commentId, newText);
            refreshComments();
            setEditingComment(null);
        } catch (error) {
            console.error('Erreur lors de la modification du commentaire:', error);
            alert('Impossible de modifier le commentaire.');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            refreshComments();
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire:', error);
            alert('Impossible de supprimer le commentaire.');
        }
    };

    return (
        <div className="mt-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const text = (e.target as HTMLFormElement).elements.namedItem('comment') as HTMLInputElement;
                    if (text.value.trim()) {
                        handleAddComment(text.value.trim());
                        text.value = '';
                    } else {
                        alert('Le commentaire ne peut pas être vide.');
                    }
                }}
            >
                <input
                    type="text"
                    name="comment"
                    placeholder="Ajouter un commentaire"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg shadow-lg">
                    Ajouter
                </button>
            </form>
            <div className="mt-4">
                {Array.isArray(item.comments) && item.comments.length > 0 ? (
                    item.comments.map((comment) => (
                        <div key={comment.id} className="mb-2">
                            {editingComment === comment.id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const newText = (e.target as HTMLFormElement).elements.namedItem('editComment') as HTMLInputElement;
                                        handleEditComment(comment.id, newText.value.trim());
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="editComment"
                                        defaultValue={comment.text}
                                        className="w-full px-2 py-1 border rounded-lg focus:outline-none"
                                    />
                                    <button type="submit" className="ml-2 px-3 py-1 bg-primary text-white rounded-lg">
                                        Sauvegarder
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600">
                                        <strong>{comment.author}:</strong> {comment.text}
                                    </p>
                                    {comment.author === currentUser && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => setEditingComment(comment.id)}
                                                className="text-blue-500 hover:underline mr-2"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
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
            </div>
        </div>
    );
    
};

export default CommentSection;
