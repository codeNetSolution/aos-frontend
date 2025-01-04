import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/routes'
import './styles/index.css'
import './App.css'
import NavBar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
};

const handleLogout = () => {
    setIsAuthenticated(false);
};


  return (
    <BrowserRouter>
        <div className="bg-light font-sans">
        <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <AppRoutes  onLogin={handleLogin} />
        </div>
    </BrowserRouter>
  );
}

export default App
