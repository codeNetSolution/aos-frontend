import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import NavBar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import SessionExpiredModal from './components/SessionExpiredModal ';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />
                <AppRoutes />
                <SessionExpiredModal />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
