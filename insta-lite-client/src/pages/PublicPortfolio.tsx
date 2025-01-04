import React from 'react';

const PublicPortfolio = () => {
    const mockData = [
        { id: 1, title: 'Œuvre 1', description: 'Description de l’œuvre 1', imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, title: 'Œuvre 2', description: 'Description de l’œuvre 2', imageUrl: 'https://via.placeholder.com/150' },
        { id: 3, title: 'Œuvre 3', description: 'Description de l’œuvre 3', imageUrl: 'https://via.placeholder.com/150' },
    ];

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-dark text-center mb-8">Portfolio Public</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {mockData.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-dark">{item.title}</h2>
                                <p className="mt-2 text-gray-600">{item.description}</p>
                                <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                                    Voir plus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicPortfolio;