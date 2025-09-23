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
    userReaction?: string | null; 
    images: {
        id: string;
        url: string;
        postId: string;
    }[];
     comments: {
        id: string;
        content: string;
        createdAt: string;
        createdBy: {
            id: string;
            firstname: string;
            lastname: string;
            avatarUrl: string;
        },
        parentId: string | null;    
       updatedAt: string;
    }[]
} 