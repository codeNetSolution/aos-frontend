import React, { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import CommentSection from './ComentSection';
import { PortfolioItem } from '../types/portfolio';
import { likePost, unlikePost } from '../utils/api';

interface PostCardProps {
    item: PortfolioItem;
    currentUser: string;
    handleAddComment: (id: number, text: string) => void;
    handleEditComment: (itemId: number, commentId: number, newText: string) => void;
    handleDeleteComment: (itemId: number, commentId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
    item,
    currentUser,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
}) => {
    const [likes, setLikes] = useState(item.likes || 0); // Assume that `likes` exists in `PortfolioItem`
    const [isLiked, setIsLiked] = useState(false);

    // Check if the current user has already liked the post
    useEffect(() => {
        const likedByUser = item.likedBy?.includes(currentUser); // Assume `likedBy` is a list of users
        setIsLiked(!!likedByUser);
    }, [item.likedBy, currentUser]);

    const handleLikeToggle = async () => {
        try {
            if (isLiked) {
                await unlikePost(item.id); // Call API to unlike
                setLikes((prev) => Math.max(prev - 1, 0));
            } else {
                await likePost(item.id); // Call API to like
                setLikes((prev) => prev + 1);
            }
            setIsLiked(!isLiked); // Toggle local state
        } catch (err) {
            console.error("Error interacting with the like button:", err);
            alert("An error occurred. Please try again.");
        }
    };

    const handleShare = () => {
        alert(`Link shared for the post "${item.title}"`);
    };

    const refreshComments = () => {
        console.log('Refresh comments for item:', item.id);
        // Implémentez la logique pour recharger les commentaires si nécessaire
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
                    {item.visibility === 'public' ? 'Public' : 'Private'}
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
                        onClick={handleLikeToggle}
                        className={`flex items-center ${
                            isLiked ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-700 text-sm`}
                    >
                        <FaHeart className="mr-2" /> {likes} J'aime
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                    >
                        <FaShareAlt className="mr-2" /> Partager
                    </button>
                </div>

                {/* Comment Section */}
                <div className="mt-4">
                    <CommentSection
                        item={item}
                        currentUser={currentUser}
                        refreshComments={refreshComments} // Passez refreshComments ici
                    />
                </div>
            </div>
        </div>
    );
};

export default PostCard;
