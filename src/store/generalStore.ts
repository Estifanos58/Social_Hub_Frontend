import { create } from "zustand";

interface GeneralState {
    isCollapsed: boolean;
    showPopup: boolean;
    setShowPopup: (input: boolean) => void;
    setIsCollapsed: (input: boolean) => void;
    isMobile: boolean;
    setMobile: (input: boolean) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({
    isCollapsed: false,
    showPopup: false,
    setShowPopup: (input: boolean) => set({ showPopup: input}),
    setIsCollapsed: (input: boolean) => set({ isCollapsed: input }),
    isMobile: false,
    setMobile: (input: boolean) => set({isMobile: input})
    
}));