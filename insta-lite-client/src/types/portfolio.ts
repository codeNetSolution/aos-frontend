export interface Comment {
    id: number;
    text: string;
    author: string; // Correspond à user.username
    postId: number; // Correspond à publication.id
    date: string; // Date ISO
}

export interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string | File;
    location?: string;
    type?: string;
    visibility: 'public' | 'private';
    likes?: number; 
    likedBy?: string[];
    comments: { id: number; text: string; author: string }[];
    filepath?: string;
    nbLike?: number;
}
