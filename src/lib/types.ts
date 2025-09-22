export interface Post { 
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        firstname: string;
        lastname: string;
        avatarUrl: string;
        lastSeenAt: string;
    };
    commentsCount: number;
    reactionsCount: number;
    images: {
        id: string;
        url: string;
        postId: string;
    }[];
} 