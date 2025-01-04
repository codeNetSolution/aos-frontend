import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';

interface CommentSectionProps {
    item: PortfolioItem;
    currentUser: string;
    handleAddComment: (id: number, text: string) => void;
    handleEditComment: (itemId: number, commentId: number, newText: string) => void;
    handleDeleteComment: (itemId: number, commentId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    item,
    currentUser,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
}) => {
    const [editingComment, setEditingComment] = useState<{ itemId: number; commentId: number } | null>(null);

    return (
        <div className="mt-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const text = (form.elements.namedItem('comment') as HTMLInputElement).value;
                    handleAddComment(item.id, text);
                    form.reset();
                }}
            >
                <input
                    type="text"
                    name="comment"
                    placeholder="Ajouter un commentaire"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    type="submit"
                    className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 shadow-lg"
                >
                    Ajouter
                </button>
            </form>
            <div className="mt-4">
                {item.comments.map((comment) => (
                    <div key={comment.id} className="mb-2">
                        {editingComment &&
                        editingComment.itemId === item.id &&
                        editingComment.commentId === comment.id ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const newText = (form.elements.namedItem('editComment') as HTMLInputElement).value;
                                    handleEditComment(item.id, comment.id, newText);
                                }}
                            >
                                <input
                                    type="text"
                                    name="editComment"
                                    defaultValue={comment.text}
                                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 px-3 py-1 bg-primary text-white rounded-lg"
                                >
                                    Sauvegarder
                                </button>
                            </form>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600"> 
                                    <strong>{comment.author}:</strong> {comment.text} </p> 
                                    {comment.author === currentUser && ( <div className="mt-2"> <button onClick={() => 
                                    setEditingComment({ itemId: item.id, commentId: comment.id }) } 
                                    className="text-blue-500 hover:underline mr-2" > Modifier </button> 
                                    <button onClick={() => handleDeleteComment(item.id, comment.id)} className="text-red-500 hover:underline" > 
                                        Supprimer 
                                        </button> 
                                        </div> )} 
                            </> )} </div> ))} </div> </div> ); };

export default CommentSection;