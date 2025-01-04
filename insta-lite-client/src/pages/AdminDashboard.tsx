import React from 'react';

const AdminDashboard = () => {
    const stats = [
        { id: 1, label: 'Images totales', value: 120 },
        { id: 2, label: 'Vidéos totales', value: 35 },
        { id: 3, label: 'Commentaires', value: 480 },
        { id: 4, label: 'Utilisateurs', value: 150 },
    ];

    return (
        <div className="min-h-screen bg-light">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-dark text-center mb-8">Tableau de Bord Administrateur</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.id} className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <h2 className="text-2xl font-bold text-dark">{stat.value}</h2>
                            <p className="mt-2 text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
