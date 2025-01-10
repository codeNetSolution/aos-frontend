{/*vérification d'autentification */}
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
    role: string;
    sub: string; 
    exp: number; 
}


export const isAuthenticated = (): boolean => {
    
    return !!localStorage.getItem('token');
};

export const login = (token: string): void => {
    localStorage.setItem('token', token);
    const decoded: JwtPayload = jwtDecode(token);
    localStorage.setItem('role', decoded.role);
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getRole = (): string | null => {
    return localStorage.getItem('role');
};

export const setUsername= (username: string): void => {
    localStorage.setItem('username', username)
}

export const getUsernameProfile = (): string | null => {
    return localStorage.getItem('username');
}