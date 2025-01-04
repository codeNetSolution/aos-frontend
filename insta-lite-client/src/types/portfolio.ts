export interface Comment {
    id: number;
    text: string;
    author: string;
}

export interface PortfolioItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    location?: string;
    visibility: 'Public' | 'Private';
    comments: Comment[];
}
