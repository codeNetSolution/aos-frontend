import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import NavBar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import SessionExpiredModal from './components/SessionExpiredModal ';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />
                <AppRoutes />
                <SessionExpiredModal />

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
