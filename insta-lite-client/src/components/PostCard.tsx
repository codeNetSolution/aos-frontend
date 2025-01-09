import React, { useState, useEffect } from 'react';
import { FaHeart, FaThumbsDown  } from 'react-icons/fa';
import CommentSection from '../components/ComentSection';
import { PortfolioItem, Comment } from '../types/portfolio';
import { likePost, unlikePost, addComment, updateComment, deleteComment, getAllComments, getPublicationById } from '../utils/api';
import Modal from './ModalEditUser';

interface PostCardProps {
    item: PortfolioItem;
    currentUser: string;
}

const PostCard: React.FC<PostCardProps> = ({ item, currentUser }) => {
    const [likes, setLikes] = useState(item.nbLike || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load likes and comments
    useEffect(() => {
        if (item.likedBy && Array.isArray(item.likedBy)) {
            setIsLiked(item.likedBy.includes(currentUser));
        }
        fetchComments();
    }, [item.likedBy, currentUser, item.id]);

    
    // Handle like toggle
    const handleLike = async () => {
        try {
            await likePost(item.id);
            setLikes((prevLikes) => prevLikes + 1); // Augmente le compteur de likes
            setIsLiked(true); // Marque comme liké
        } catch (error) {
            console.error('Error liking post:', error);
            alert('An error occurred while liking the post.');
        }
    };

    const handleDislike = async () => {
        try {
            await unlikePost(item.id);
            setLikes((prevLikes) => Math.max(prevLikes - 1, 0)); // Diminue le compteur de likes
            setIsLiked(false); // Marque comme non liké
        } catch (error) {
            console.error('Error disliking post:', error);
            alert('An error occurred while disliking the post.');
        }
    };
    

    const fetchUpdatedPost = async () => {
        try {
            const updatedPost: PortfolioItem = await getPublicationById(item.id);
    
            // Utilise une valeur par défaut si updatedPost.nbLike est undefined
            setLikes(updatedPost.nbLike ?? 0); // Utilise 0 si nbLike est undefined
    
            if (updatedPost.likedBy && Array.isArray(updatedPost.likedBy)) {
                setIsLiked(updatedPost.likedBy.includes(currentUser));
            }
        } catch (error) {
            console.error("Error fetching updated post data:", error);
        }
    };

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response: any = await getAllComments();
            const postComments = response.filter(
                (comment: any) => comment.publication.id === item.id // Vérifiez publication.id
            );
    
            // Transformez les commentaires pour correspondre au type `Comment`
            const formattedComments: Comment[] = postComments.map((comment: any) => ({
                id: comment.id,
                text: comment.text,
                author: comment.user.username, 
                postId: comment.publication.id,
                date: comment.date,
            }));
    
            setComments(formattedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    

    // Add a new comment
    const handleAddComment = async (text: string) => {
        if (!text.trim()) {
            alert('Le commentaire ne peut pas être vide.');
            return;
        }

        try {
            const newCommentData = await addComment(item.id, text);
    
            const newComment: Comment = {
                id: newCommentData.id,
                text: newCommentData.text,
                author: newCommentData.user.username, // Récupérez l'auteur
                postId: newCommentData.publication.id, // Récupérez l'ID de la publication
                date: newCommentData.date, // Récupérez la date
            };
    
            setComments((prevComments) => [...prevComments, newComment]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Edit an existing comment
    const handleEditComment = async (commentId: number, newText: string) => {
        try {
            const updatedCommentData = await updateComment(commentId, newText);
    
            // Transformez l'objet pour correspondre au type `Comment`
            const updatedComment: Comment = {
                id: updatedCommentData.id,
                text: updatedCommentData.text,
                author: updatedCommentData.user.username, // Récupérez le nom de l'auteur
                postId: updatedCommentData.publication.id, // Récupérez l'ID de la publication
                date: updatedCommentData.date, // Date de modification
            };
    
            setComments((prevComments) =>
                prevComments.map((comment) => (comment.id === commentId ? updatedComment : comment))
            );
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };
    

    // Delete a comment
    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Share post handler
    const handleShare = () => {
        alert(`Link shared for the post "${item.title}"`);
    };


    const handleShowAllComments = () => {
        setIsModalOpen(true); // Ouvre la modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Ferme la modal
    };

    return (
        <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {/* Media Section */}
            <div className="relative">
                {typeof item.imageUrl === 'string' && item.imageUrl.endsWith('.mp4') ? (
                    <video
                        src={item.imageUrl}
                        className="w-full h-64 object-cover rounded-t-xl"
                        controls
                    />
                ) : typeof item.imageUrl === 'string' ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <p className="text-sm text-gray-500">Fichier non supporté</p>
                )}
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.type === 'public' ? 'Public' : 'Private'}
                </div>
            </div>

            {/* Post Info Section */}
            <div className="p-6">
                <h2 className="text-lg font-semibold text-dark truncate">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                {item.location && (
                    <p className="text-sm text-primary mt-2">📍 {item.location}</p>
                )}

                {/* Interaction Buttons */}
                <div className="flex items-center justify-between mt-4">
                    <button
                            onClick={handleLike}
                            className="flex items-center text-gray-500 hover:text-red-500 text-sm"
                    >
                        <FaHeart className="mr-2" /> {likes} J'aime
                    </button>
                    <button
                        onClick={handleDislike}
                        className="flex items-center text-gray-500 hover:text-blue-500 text-sm"
                    >
                        <FaThumbsDown className="mr-2" /> Dislike
                    </button>
                </div>

                {/* Comment Section */}
                <div className="mt-4">
                    <CommentSection
                        item={item}
                        currentUser={currentUser}
                        comments={comments}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostCard;
