{/* Gestion des appels API */}
import axios from 'axios';
import { User } from '../types/user';

const api = axios.create({
    baseURL: 'http://localhost:8080', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};

export const getUserById = async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (user: {email: string; password: string; username: string, role: string; profilePic: string}) => {
    const response = await api.post('/users', user);
    return response.data;
}

export const updateUser = async (id: number, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
}

export const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
};


export default api;
