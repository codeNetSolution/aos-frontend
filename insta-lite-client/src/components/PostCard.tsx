import React, { useState } from 'react';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import CommentSection from './ComentSection';
import { PortfolioItem } from '../types/portfolio';

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
    const [likes, setLikes] = useState(0);

    const handleLike = () => {
        setLikes((prev) => prev + 1);
    };

    const handleShare = () => {
        alert(`Lien partagé pour le post "${item.title}"`);
    };

    return (
        <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {/* Media Section */}
            <div className="relative">
                {item.imageUrl.endsWith('.mp4') ? (
                    <video
                        src={item.imageUrl}
                        className="w-full h-64 object-cover rounded-t-xl"
                        controls
                    />
                ) : (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.visibility === 'Public' ? 'Public' : 'Privé'}
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
                        className="flex items-center text-red-500 hover:text-red-700 text-sm"
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
                        handleAddComment={handleAddComment}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostCard;
