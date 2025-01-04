import React, { useState } from 'react';
import { PortfolioItem } from '../types/portfolio';
import Modal from '../components/modalNewPost';
import PostCard from '../components/PostCard';

const PrivatePortfolio = () => {
    const [mockData, setMockData] = useState<PortfolioItem[]>([
        { id: 1, title: 'Image 1', description: 'Description de l’image 1', imageUrl: 'https://via.placeholder.com/150', visibility: 'Public', comments: [] },
        { id: 2, title: 'Vidéo 1', description: 'Description de la vidéo 1', imageUrl: 'https://via.placeholder.com/150', visibility: 'Private', comments: [] },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState<Partial<PortfolioItem>>({
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        visibility: 'Public',
    });

    const [currentUser] = useState('karim');

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
            visibility: newPost.visibility as 'Public' | 'Private',
            comments: [],
        };

        setMockData((prevData) => [newPostData, ...prevData]);
        setNewPost({ title: '', description: '', imageUrl: '', location: '', visibility: 'Public' });
        setIsModalOpen(false);
    };

    const handleAddComment = (id: number, text: string) => {
        const updatedData = mockData.map((item) =>
            item.id === id
                ? { ...item, comments: [...item.comments, { id: Date.now(), text, author: currentUser }] }
                : item
        );
        setMockData(updatedData);
    };

    const handleEditComment = (itemId: number, commentId: number, newText: string) => {
        const updatedData = mockData.map((item) =>
            item.id === itemId
                ? {
                      ...item,
                      comments: item.comments.map((comment) =>
                          comment.id === commentId ? { ...comment, text: newText } : comment
                      ),
                  }
                : item
        );
        setMockData(updatedData);
    };

    const handleDeleteComment = (itemId: number, commentId: number) => {
        const updatedData = mockData.map((item) =>
            item.id === itemId
                ? { ...item, comments: item.comments.filter((comment) => comment.id !== commentId) }
                : item
        );
        setMockData(updatedData);
    };

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-dark">Portfolio Privé</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-opacity-90"
                    >
                        Nouveau Post
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockData.map((item) => (
                        <PostCard
                            key={item.id}
                            item={item}
                            currentUser={currentUser}
                            handleAddComment={handleAddComment}
                            handleEditComment={handleEditComment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPost}
                newPost={newPost}
                setNewPost={setNewPost}
            />
        </div>
    );
};

export default PrivatePortfolio;