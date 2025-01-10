import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types/portfolio';
import { getPublicMedia } from '../utils/api';

interface PostCardProps {
    item: PortfolioItem;
}

const PostCardPublic: React.FC<PostCardProps> = ({ item }) => {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const url = await getPublicMedia(item.mediaUrl as string);
                setMediaUrl(url);
            } catch (error) {
                console.error('Erreur lors du chargement du média :', error);
            }
        };

        if (item.mediaUrl) {
            fetchMedia();
        }
    }, [item.mediaUrl]);

    return (
        <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="relative">
                {item.mediaUrl ? (
                    item.mediaUrl.endsWith('.mp4') ? (
                        <video
                            src={mediaUrl as string}
                            className="w-full h-64 object-cover rounded-t-xl"
                            
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
                    {item.postType === 'PUBLIC' ? 'Public' : 'Privé'}
                </div>
            </div>
            <div className="p-6">
                <h2 className="text-lg font-semibold text-dark truncate">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                { (
                    <div className="flex items-center justify-between mt-4">
                        <p
                            className="flex items-center text-gray-500 hover:text-red-500 text-sm"
                            
                        >
                            {item.nbLike} ❤️ J'aime
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCardPublic;
