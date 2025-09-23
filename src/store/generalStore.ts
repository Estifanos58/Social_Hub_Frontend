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
}));