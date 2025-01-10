import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types/portfolio';
import Modal from '../components/modalNewPost';
import PostCard from '../components/PostCard';
import { getAllPublications,deletePublication, updatePublication  } from '../utils/api';

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

    const addPost = (newPost: PortfolioItem) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const convertToFormData = (data: {
        description?: string;
        postType?: string;
        mediaFile?: File | null;
    }): FormData => {
        const formData = new FormData();
    
        if (data.description) {
            formData.append("description", data.description);
        }
    
        if (data.postType) {
            formData.append("postType", data.postType);
        }
    
        if (data.mediaFile) {
            formData.append("mediaFile", data.mediaFile);
        }
    
        return formData;
    };
    
    

    const handleEditPost = async (postId: number, updatedPost: Partial<PortfolioItem>) => {
        try {
            const formData = convertToFormData({
                description: updatedPost.description,
                postType: updatedPost.postType,
            });
            const updatedData = await updatePublication(postId, formData);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, ...updatedData } : post
                )
            );
        } catch (error) {
            console.error("Erreur lors de la modification de la publication :", error);
            alert("Une erreur est survenue lors de la modification de la publication.");
        }
    };
    
    const handleDeletePost = async (postId: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
            return;
        }

        try {
            await deletePublication(postId); 
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la publication :", error);
            alert("Une erreur est survenue lors de la suppression de la publication.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-16">
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
                                    onDeletePost={handleDeletePost}
                                    onEditPost={handleEditPost}
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
                addPost={addPost}
            />
        </div>
    );
};

export default PrivatePortfolio;
