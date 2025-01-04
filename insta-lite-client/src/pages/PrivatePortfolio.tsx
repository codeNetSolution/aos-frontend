import React, { useState } from 'react';

interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    comments: Comment[];
}

interface Comment {
    id: number;
    text: string;
    author: string;
}

const PrivatePortfolio = () => {
    const [mockData, setMockData] = useState<PortfolioItem[]>([
        { id: 1, title: 'Image 1', description: 'Description de l’image 1', imageUrl: 'https://via.placeholder.com/150', comments: [] },
        { id: 2, title: 'Vidéo 1', description: 'Description de la vidéo 1', imageUrl: 'https://via.placeholder.com/150', comments: [] },
    ]);

    const [editingComment, setEditingComment] = useState<{ itemId: number; commentId: number } | null>(null);
    const [currentUser] = useState('karim');
    const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

    const handleAddComment = (id: number, text: string) => {
        const updatedData = mockData.map(item =>
            item.id === id
                ? { ...item, comments: [...item.comments, { id: Date.now(), text, author: currentUser }] }
                : item
        );
        setMockData(updatedData);
    };

    const handleEditComment = (itemId: number, commentId: number, newText: string) => {
        const updatedData = mockData.map(item =>
            item.id === itemId
                ? {
                      ...item,
                      comments: item.comments.map(comment =>
                          comment.id === commentId ? { ...comment, text: newText } : comment
                      ),
                  }
                : item
        );
        setMockData(updatedData);
        setEditingComment(null);
    };

    const handleDeleteComment = (itemId: number, commentId: number) => {
        const updatedData = mockData.map(item =>
            item.id === itemId
                ? { ...item, comments: item.comments.filter(comment => comment.id !== commentId) }
                : item
        );
        setMockData(updatedData);
    };

    const toggleShowMore = (itemId: number) => {
        setExpandedComments(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-dark text-center mb-8">Portfolio Privé</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {mockData.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-dark">{item.title}</h2>
                                <p className="mt-2 text-gray-600">{item.description}</p>
                                <div className="mt-4">
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const text = (form.elements.namedItem('comment') as HTMLInputElement).value;
                                            handleAddComment(item.id, text);
                                            form.reset();
                                        }}
                                    >
                                        <input
                                            type="text"
                                            name="comment"
                                            placeholder="Ajouter un commentaire"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <button
                                            type="submit"
                                            className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 shadow-lg"
                                        >
                                            Ajouter
                                        </button>
                                    </form>
                                </div>
                                <div className="mt-4">
                                    {item.comments.slice(0, expandedComments[item.id] ? item.comments.length : 3).map(comment => (
                                        <div key={comment.id} className="mb-2 flex justify-between items-center">
                                            {editingComment &&
                                            editingComment.itemId === item.id &&
                                            editingComment.commentId === comment.id ? (
                                                <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        const form = e.target as HTMLFormElement;
                                                        const newText = (form.elements.namedItem('editComment') as HTMLInputElement).value;
                                                        handleEditComment(item.id, comment.id, newText);
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        name="editComment"
                                                        defaultValue={comment.text}
                                                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="ml-2 px-3 py-1 bg-primary text-white rounded-lg"
                                                    >
                                                        Sauvegarder
                                                    </button>
                                                </form>
                                            ) : (
                                                <>
                                                    <p className="text-gray-600 text-sm flex-1">
                                                        <strong>{comment.author}:</strong> {comment.text}
                                                    </p>
                                                    {comment.author === currentUser && (
                                                        <div className="ml-4">
                                                            <button
                                                                onClick={() =>
                                                                    setEditingComment({
                                                                        itemId: item.id,
                                                                        commentId: comment.id,
                                                                    })
                                                                }
                                                                className="text-blue-500 hover:underline mr-2"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(item.id, comment.id)}
                                                                className="text-red-500 hover:underline"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {item.comments.length > 3 && (
                                        <button
                                            onClick={() => toggleShowMore(item.id)}
                                            className="text-blue-500 hover:underline text-sm mt-2"
                                        >
                                            {expandedComments[item.id] ? 'Afficher moins' : 'Afficher plus'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrivatePortfolio;
