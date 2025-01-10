import React, { useEffect, useState } from 'react';
import { getAdminStats, getRecentActivities } from '../utils/api';
import { Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatCardProps {
    value: number;
    label: string;
    icon: JSX.Element;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg p-6 flex items-center">
        <div className="text-4xl mr-4">{icon}</div>
        <div>
            <h2 className="text-3xl font-bold">{value}</h2>
            <p className="text-sm uppercase tracking-wide">{label}</p>
        </div>
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="bg-gray-300 rounded-lg shadow-lg h-24 animate-pulse"></div>
);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPublications: 0,
        totalImages: 0,
        totalVideos: 0,
        totalComments: 0,
    });
    const [activities, setActivities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const statsData = await getAdminStats();
                setStats(statsData);

                const recentActivities = await getRecentActivities();
                setActivities(recentActivities);
            } catch (err) {
                setError('Erreur lors du chargement des données.');
                toast.error('Erreur lors du chargement des données.', { position: 'top-right', theme: 'colored' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    const chartData = {
        labels: ['Images', 'Vidéos'],
        datasets: [
            {
                data: [stats.totalImages, stats.totalVideos],
                backgroundColor: ['#FF6384', '#36A2EB'],
            },
        ],
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Tableau de Bord Administrateur</h1>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="space-y-8">
                        {/* Statistiques globales */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                value={stats.totalUsers}
                                label="Utilisateurs"
                                icon={<i className="fas fa-users"></i>}
                            />
                            <StatCard
                                value={stats.totalPublications}
                                label="Publications"
                                icon={<i className="fas fa-file-alt"></i>}
                            />
                            <StatCard
                                value={stats.totalComments}
                                label="Commentaires"
                                icon={<i className="fas fa-comments"></i>}
                            />
                            <StatCard
                                value={stats.totalImages + stats.totalVideos}
                                label="Médias"
                                icon={<i className="fas fa-photo-video"></i>}
                            />
                        </div>

                        {/* Graphiques */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Répartition des Médias</h2>
                            <div className="flex justify-center">
                                <div className="w-64 h-64">
                                    <Doughnut data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Dernières activités */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Dernières Activités</h2>
                            {activities.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-700">
                                    {activities.map((activity, index) => (
                                        <li key={index}>{activity}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Aucune activité récente.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
