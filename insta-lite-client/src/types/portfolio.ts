export interface Comment {
    id: number;
    text: string;
    author: string;
}

export interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string | File;
    location?: string;
    visibility: 'public' | 'private';
    likes?: number; 
    likedBy?: string[];
    comments: { id: number; text: string; author: string }[];
    filepath?: string;
    nbLike?: number;
}
