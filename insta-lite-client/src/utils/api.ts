{/* Gestion des appels API */}
import axios from 'axios';
import { User } from '../types/user';
import {PortfolioItem } from '../types/portfolio';

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

export const getProfile = async (email: string): Promise<User> => {
    try {
        const response = await api.get(`/api/users/${email}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération du profil pour ${email} :`, error);
        throw error;
    }
};

export const updateProfile = async (email: string, user: Partial<User>): Promise<User> => {
    try {
        const response = await api.put(`/api/users/${email}`, user);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du profil pour ${email} :`, error);
        throw error;
    }
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

//////////////////////////////////////// Like/Unlike POST ////////////////////////
export const likePost = async (postId: number): Promise<void> => {
    await api.post(`/api/like/${postId}`);
};

export const unlikePost = async (postId: number): Promise<void> => {
    await api.delete(`/api/like/${postId}`);
};


///////////////////////////////// Publications ////////////////////////////////////////////


export const getAllPublications = async () => {
    const response = await api.get('/api/posts');
    return response.data;
};

export const createPublication = async (formData: FormData) => {
    const response = await api.post('/api/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updatePublication = async (id: number, formData: FormData) => {
    const response = await api.put(`/api/posts/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deletePublication = async (id: number) => {
    const response = await api.delete(`/api/posts/${id}`);
    return response.data;
};

/////////////////////// Comments /////////////////////////
export const getAllComments = async (): Promise<Comment[]> => {
    const response = await api.get('/api/comments');
    return response.data;
};

export const addComment = async (postId: number, text: string): Promise<Comment> => {
    const response = await api.post(`/api/comments/${postId}`, { text });
    return response.data;
};

export const updateComment = async (commentId: number, text: string): Promise<Comment> => {
    const response = await api.put(`/api/comments/${commentId}`, { text });
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await api.delete(`/api/comments/${commentId}`);
};

export const getPublicPublications = async (): Promise<PortfolioItem[]> => {
    try {
        const response = await api.get('/api/post-public/');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des publications publiques :", error);
        throw error;
    }
};


export default api;
