import react, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import PublicPortfolio from '../pages/PublicPortfolio';
import PrivatePortfolio from '../pages/PrivatePortfolio';
import AdminDashboard from '../pages/AdminDashboard';
import AdminManagement from '../pages/AdminManagement';
import NotFoundPage from '../pages/NotFoundPage';

const ProtectedRoute = ({ Component: Component, role }: {
    Component: React.ComponentType; role:String
}) => {
    const isAuthenticated = true;
    const userRole = 'user';

    if (!isAuthenticated){
        return <Navigate to="/login" />;
    }

    if(role && userRole !==role) {
        return <Navigate to ="/" />;
    }

    return <Component />;
};


const AppRoutes = ({ onLogin }: { onLogin: () => void }) => (
    <Routes>
        {/* routes publique*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="/portfolio/public" element={<PublicPortfolio />} />

        {/*routes protégés */}
        <Route path="/profile" element={<ProtectedRoute Component={ProfilePage} role="user" />} />
        <Route path="/portfolio/private" element={<ProtectedRoute Component={PrivatePortfolio} role="user" />} />

        {/*routes admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute Component={AdminDashboard} role="user" />} />
        <Route path="/admin/management" element={<ProtectedRoute Component={AdminManagement} role="user" />} />

        {/*fallback */}
        <Route path="*" element={<NotFoundPage />} />

    </Routes>
);

export default AppRoutes;