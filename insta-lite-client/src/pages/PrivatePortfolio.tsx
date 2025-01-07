import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types/portfolio';
import Modal from '../components/modalNewPost';
import PostCard from '../components/PostCard';
import { getAllPublications } from '../utils/api';

const PrivatePortfolio: React.FC = () => {
    const [posts, setPosts] = useState<PortfolioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState<Partial<PortfolioItem>>({
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        visibility: 'public',
    });

    const [currentUser] = useState('karim');
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

    const handleAddPost = () => {
        if (!newPost.title || !newPost.imageUrl) {
            alert('Le titre et l’image sont obligatoires.');
            return;
        }

        const newPostData: PortfolioItem = {
            id: Date.now(),
            title: newPost.title!,
            description: newPost.description || '',
            imageUrl: newPost.imageUrl!,
            location: newPost.location || '',
            visibility: newPost.visibility as 'public' | 'private',
            comments: [],
        };

        setPosts((prevPosts) => [newPostData, ...prevPosts]);
        setNewPost({ title: '', description: '', imageUrl: '', location: '', visibility: 'public' });
        setIsModalOpen(false);
    };

    const handleCommentActions = (action: string, itemId: number, commentId?: number, text?: string) => {
        const updatedPosts = posts.map((item) => {
            if (item.id === itemId) {
                if (action === 'add') {
                    return {
                        ...item,
                        comments: [...item.comments, { id: Date.now(), text: text!, author: currentUser }],
                    };
                }
                if (action === 'edit') {
                    return {
                        ...item,
                        comments: item.comments.map((comment) =>
                            comment.id === commentId ? { ...comment, text: text! } : comment
                        ),
                    };
                }
                if (action === 'delete') {
                    return {
                        ...item,
                        comments: item.comments.filter((comment) => comment.id !== commentId),
                    };
                }
            }
            return item;
        });

        setPosts(updatedPosts);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Portfolio Privé</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg shadow-lg hover:bg-opacity-90"
                    >
                        Nouveau Post
                    </button>
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
                                    handleAddComment={(id, text) => handleCommentActions('add', id, undefined, text)}
                                    handleEditComment={(itemId, commentId, newText) =>
                                        handleCommentActions('edit', itemId, commentId, newText)
                                    }
                                    handleDeleteComment={(itemId, commentId) =>
                                        handleCommentActions('delete', itemId, commentId)
                                    }
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newPost={newPost}
                setNewPost={setNewPost}
            />
        </div>
    );
};

export default PrivatePortfolio;
