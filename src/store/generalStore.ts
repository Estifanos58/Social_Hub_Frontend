import { create } from "zustand";

interface GeneralState {
    isCollapsed: boolean;
    setIsCollapsed: (input: boolean) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({
    isCollapsed: false,
    setIsCollapsed: (input: boolean) => set({ isCollapsed: input }),
}));