import React, { useState, useEffect } from 'react';
import { FaHeart, FaThumbsDown  } from 'react-icons/fa';
import CommentSection from '../components/ComentSection';
import { PortfolioItem, Comment } from '../types/portfolio';
import { likePost, unlikePost, addComment, updateComment, deleteComment, getAllComments, getPublicMedia,
    getPrivateMedia 
 } from '../utils/api';


interface PostCardProps {
    item: PortfolioItem;
    currentUser: string;
    isPremium: boolean;
    onDeletePost: (id: number) => void;
    onEditPost: (id: number, updatedPost: Partial<PortfolioItem>) => void;
}

const PostCard: React.FC<PostCardProps> = ({ item, currentUser, onDeletePost, onEditPost, isPremium }) => {
    const [likes, setLikes] = useState(item.nbLike || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [editedPost, setEditedPost] = useState<Partial<PortfolioItem>>(item);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (item.likedBy && Array.isArray(item.likedBy)) {
            setIsLiked(item.likedBy.includes(currentUser));
        }
        fetchComments();
    }, [item.likedBy, currentUser, item.id]);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const url = item.postType === 'PUBLIC'
                    ? await getPublicMedia(item.mediaUrl as string)
                    : await getPrivateMedia(item.mediaUrl as string);
                setMediaUrl(url);
            } catch (error) {
                console.error('Error fetching media:', error);
            }
        };

        if (item.mediaUrl) {
            fetchMedia();
        }
    }, [item.mediaUrl, item.postType]);

    useEffect(() => {
        if (isEditModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isEditModalOpen]);


    const handleLike = async () => {
        try {
            await likePost(item.id);
            setLikes((prevLikes) => prevLikes + 1); 
            setIsLiked(true); 
        } catch (error) {
            console.error('Error liking post:', error);
            alert('An error occurred while liking the post.');
        }
    };

    

    const handleDislike = async () => {
        try {
            await unlikePost(item.id);
            setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
            setIsLiked(false);
        } catch (error) {
            console.error('Error disliking post:', error);
            alert('An error occurred while disliking the post.');
        }
    };
    
    const handleOpenEditModal = () => {
        setEditedPost(item); 
        setIsEditModalOpen(true);
    };

    const handleEditPost = () => {
        onEditPost(item.id, editedPost);
        setIsEditModalOpen(false); 
    }
    
    const fetchComments = async () => {
        try {
            const response: any = await getAllComments();
            const postComments = response.filter(
                (comment: any) => comment.publication.id === item.id 
            );
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
                author: newCommentData.user.username, 
                postId: newCommentData.publication.id, 
                date: newCommentData.date, 
            };
    
            setComments((prevComments) => [...prevComments, newComment]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleEditComment = async (commentId: number, newText: string) => {
        try {
            const updatedCommentData = await updateComment(commentId, newText);
            const updatedComment: Comment = {
                id: updatedCommentData.id,
                text: updatedCommentData.text,
                author: updatedCommentData.user.username,
                postId: updatedCommentData.publication.id,
                date: updatedCommentData.date, 
            };
    
            setComments((prevComments) =>
                prevComments.map((comment) => (comment.id === commentId ? updatedComment : comment))
            );
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };
    
    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {/* Media Section */}
            <div className="relative">
                {item.mediaUrl ? (
                    item.mediaUrl.endsWith('.mp4') ? (
                        <video
                            src={mediaUrl as string} 
                            className="w-full h-64 object-cover rounded-t-xl"
                            controls
                        />
                    ) : (
                        <img
                            src={mediaUrl as string} 
                            alt={item.title}
                            className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                        />
                    )
                ) : (
                    <p className="text-sm text-gray-500">Fichier non supporté</p>
                )}

                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.postType === 'PUBLIC' ? 'Public' : 'Private'}
                </div>
            </div>

            {/* Post Info Section */}
            <div className="p-6">
                <h2 className="text-lg font-semibold text-dark truncate">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>

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
                
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handleOpenEditModal}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => onDeletePost(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                        Supprimer
                    </button>
                </div>

                {/* Comment Section */}
                <div className="mt-4">
                    <CommentSection
                        item={item}
                        currentUser={currentUser}
                        isPremium={isPremium}
                        comments={comments}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                    />
                </div>

            </div>
            {/* Modal pour modification */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Modifier la publication</h2>
                        <textarea
                            placeholder="Description"
                            value={editedPost.description || ''}
                            onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                            className="w-full mb-2 px-3 py-2 border rounded-lg"
                        />
                        <select
                            value={editedPost.postType || 'PUBLIC'}
                            onChange={(e) => setEditedPost({ ...editedPost, postType: e.target.value as 'PUBLIC' | 'PRIVATE'})}
                            className="w-full mb-2 px-3 py-2 border rounded-lg"
                        >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Privé</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={handleEditPost}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PostCard;
