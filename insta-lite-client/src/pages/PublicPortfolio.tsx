import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types/portfolio';
import PostCard from '../components/PostCard';
import { getAllPublications } from '../utils/api';

const PublicPortfolio: React.FC = () => {
    const [posts, setPosts] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentUser] = useState('saidoabd');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllPublications();
                setPosts(data);
            } catch {
                setError("Erreur lors du chargement des publications.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Portfolio Pubic</h1>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500">Chargement des publications...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {currentPosts.map((item) => (
                                <PostCard
                                    key={item.id}
                                    item={item}
                                    currentUser={currentUser}
                                    
                                />
                            ))}
                        </div>

                        <div className="flex justify-center mt-6">
                            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`mx-1 px-4 py-2 rounded-lg font-medium ${
                                        currentPage === i + 1
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    } hover:bg-primary hover:text-white transition-colors`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PublicPortfolio;
