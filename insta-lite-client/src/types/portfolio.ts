export interface Comment {
    id: number;
    text: string;
    userId: number;
    author: string; // Correspond à user.username
    postId: number; // Correspond à publication.id
    date: string; // Date ISO
    profilePic?: string;
}

export interface PortfolioItem {
    id: number;
    title?: string;
    description?: string;
    imageUrl?: string | File;
    mediaType?: 'IMAGE' | 'VIDEO' | string;
    location?: string;
    type?: string;
    mediaUrl?: 'IMAGE' | 'VIDEO' | string;
    postType?: 'PUBLIC' | 'PRIVATE';
    visibility?: 'public' | 'private';
    likes?: number; 
    likedBy?: string[];
    comments: { id: number; text: string; author: string }[];
    filepath?: string;
    nbLike?: number;
    datePublication?: Date | string;
}
