import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated as checkAuth, login as saveToken, logout as clearToken, getRole } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
import SessionExpiredModal from '../components/SessionExpiredModal';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
}

interface DecodedToken {
    exp: number;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
    const [role, setRole] = useState<string | null>(getRole());
    const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: DecodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp <= currentTime) {
                setIsSessionExpired(true);
                logout();
            }
        }
    };

    const login = (token: string) => {
        saveToken(token);
        setIsAuthenticated(true);
        setRole(getRole());
        setIsSessionExpired(false);
    };

    const logout = () => {
        clearToken();
        setIsAuthenticated(false);
        setRole(null);
        setIsSessionExpired(false);
    };

    
    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
            {isSessionExpired && <SessionExpiredModal onLogout={logout} />}
        </AuthContext.Provider>
    );
};



export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
