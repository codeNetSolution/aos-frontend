import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import PublicPortfolio from '../pages/PublicPortfolio';
import PrivatePortfolio from '../pages/PrivatePortfolio';
import AdminDashboard from '../pages/AdminDashboard';
import AdminManagement from '../pages/AdminManagement';
import NotFoundPage from '../pages/NotFoundPage';
import SignupPage from '../pages/SignupPage';
import ProtectedRoute from './RoleProtectedRouteProps';
import PublicPublication from '../pages/PublicPublication';




const AppRoutes = ()=> (
    
    <Routes>
        {/* routes publique*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />;
        <Route path="/discover" element={<PublicPublication />} />

        {/* Routes protégées */}
        <Route
            path="/portfolio/public"
            element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_USER', 'ROLE_PREMIUM']}>
                    <PublicPortfolio />
                </ProtectedRoute>
            }
        />

        <Route
            path="/profile"
            element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_USER', 'ROLE_PREMIUM']}>
                    <ProfilePage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/portfolio/private"
            element={
                <ProtectedRoute allowedRoles={['ROLE_PREMIUM', 'ROLE_ADMIN']}>
                    <PrivatePortfolio />
                </ProtectedRoute>
            }
        />

        {/* Routes admin */}
        <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/management"
            element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminManagement />
                </ProtectedRoute>
            }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;