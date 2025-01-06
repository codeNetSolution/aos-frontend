import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated as checkAuth, login as saveToken, logout as clearToken, getRole } from '../utils/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
    const [role, setRole] = useState<string | null>(getRole());

    const login = (token: string) => {
        saveToken(token);
        setIsAuthenticated(true);
        setRole(getRole());
    };

    const logout = () => {
        clearToken();
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
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
