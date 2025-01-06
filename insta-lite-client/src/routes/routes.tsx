import react, { Children, Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import PublicPortfolio from '../pages/PublicPortfolio';
import PrivatePortfolio from '../pages/PrivatePortfolio';
import AdminDashboard from '../pages/AdminDashboard';
import AdminManagement from '../pages/AdminManagement';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import SignupPage from '../pages/SignupPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


const AppRoutes = ()=> (
    
    <Routes>
        {/* routes publique*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />;
        <Route path="/portfolio/public" element={<PublicPortfolio />} />

        {/* Routes protégées */}
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/portfolio/private"
            element={
                <ProtectedRoute>
                    <PrivatePortfolio />
                </ProtectedRoute>
            }
        />

        {/* Routes admin */}
        <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute>
                    <AdminDashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/management"
            element={
                <ProtectedRoute>
                    <AdminManagement />
                </ProtectedRoute>
            }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />

        {/*fallback */}
        <Route path="*" element={<NotFoundPage />} />

    </Routes>
);

export default AppRoutes;