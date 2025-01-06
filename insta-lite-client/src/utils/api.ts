{/* Gestion des appels API */}
import axios from 'axios';
import { User } from '../types/user';

const api = axios.create({
    baseURL: 'http://localhost:8080', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Session expirée. Veuillez vous reconnecter.');

            const event = new CustomEvent('sessionExpired');
            window.dispatchEvent(event);
            await logoutUser();
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

///////////////////////////////// Users ////////////////////////////////////////////
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        throw error;
    }
};

export const getUserById = async (id: number) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
};

export const createUser = async (user: {email: string; password: string; username: string, role: string; profilePic: string}) => {
    const response = await api.post('/api/users', user);
    return response.data;
}

export const updateUser = async (id: number, user: Partial<User>) => {
    const response = await api.put(`/api/users/${id}`, user);
    return response.data;
}

export const deleteUser = async (id: number) => {
    await api.delete(`/api/users/${id}`);
};

export const getProfile = async (): Promise<User> => {
    const response = await api.get('/api/users/me');
    return response.data;
};

export const updateProfile = async (user: Partial<User>): Promise<User> => {
    const response = await api.put('/api/users/me', user);
    return response.data;
};

///////////////////////////////// Auth ////////////////////////////////////////////

export const loginUser = async (email: string, password: string): Promise<string> => {
    const response = await api.post('/api/auth/login', {email, password});
    console.log(response.data.token)
    return response.data.token;
}

export const registerUser= async (user: {
    email: string;
    password: string;
    username: string;
}) : Promise<void> => {
    await api.post('/api/auth/register', user);
};


export const logoutUser = async ():Promise<void> => {
    await api.post('/api/auth/logout', null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};



export default api;
