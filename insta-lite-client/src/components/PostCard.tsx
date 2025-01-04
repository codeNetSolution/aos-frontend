import React from 'react';
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
    return (
        <div className="relative group bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-lg font-bold">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
                {item.location && <p className="text-sm text-gray-300">📍 {item.location}</p>}
                <p className="text-sm text-gray-300">Visibilité : {item.visibility}</p>
            </div>
            <div className="p-4">
                <CommentSection
                    item={item}
                    currentUser={currentUser}
                    handleAddComment={handleAddComment}
                    handleEditComment={handleEditComment}
                    handleDeleteComment={handleDeleteComment}
                />
            </div>
        </div>
    );
};

export default PostCard;
