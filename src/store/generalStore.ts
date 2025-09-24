import { create } from "zustand";


export interface SelectedPost {
    id: string;
    content: string;
    createdAt: string;
    createdBy: {
        id: string;
        firstname: string;
        lastname: string;
        avatarUrl: string;
    },
    images: {
        id: string;
        url: string;
    }[],
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

interface GeneralState {
    isCollapsed: boolean;
    showPopup: boolean;
    setShowPopup: (input: boolean) => void;
    setIsCollapsed: (input: boolean) => void;
    isMobile: boolean;
    setMobile: (input: boolean) => void;
    selectedPopUp: string | null;
    setSelectedPopUp: (input: string) => void; 

    selectedPost: SelectedPost | null;
    setSelectedPost: (input: SelectedPost | null) => void;

    // Comments
    setPostComment: (
        content: string,
        postId: string,
        user: { id: string; firstname: string; lastname: string; avatarUrl: string }
    ) => void;
    setReplayComment: (
        parentId: string,
        content: string,
        user: { id: string; firstname: string; lastname: string; avatarUrl: string }
    ) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({

    // UI
    isCollapsed: false,
    showPopup: false,
    setShowPopup: (input: boolean) => set({ showPopup: input}),
    setIsCollapsed: (input: boolean) => set({ isCollapsed: input }),
    isMobile: false,
    setMobile: (input: boolean) => set({isMobile: input}),
    selectedPopUp: null,
    setSelectedPopUp: (input: string) => set({selectedPopUp: input }),

    // Data
    selectedPost: null,
    setSelectedPost: (input: SelectedPost | null) => set({selectedPost: input}),

    // Comments
    setPostComment: (content, postId, user) => set((state) => {
        if (!state.selectedPost || state.selectedPost.id !== postId) return {} as any;
        const now = new Date().toISOString();
        const newComment = {
            id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            createdAt: now,
            createdBy: user,
            parentId: null as string | null,
            updatedAt: now,
        };
        return {
            selectedPost: {
                ...state.selectedPost,
                comments: [newComment, ...(state.selectedPost.comments || [])],
            },
        };
    }),

    setReplayComment: (parentId, content, user) => set((state) => {
        if (!state.selectedPost) return {} as any;
        // Optionally ensure parent exists in the current comments list
        const parentExists = state.selectedPost.comments?.some((c) => c.id === parentId);
        if (!parentExists) return {} as any;
        const now = new Date().toISOString();
        const newReply = {
            id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            content,
            createdAt: now,
            createdBy: user,
            parentId,
            updatedAt: now,
        };
        return {
            selectedPost: {
                ...state.selectedPost,
                comments: [newReply, ...(state.selectedPost.comments || [])],
            },
        };
    }),
}));