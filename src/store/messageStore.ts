import { create } from "zustand";

interface MessageState {
    selectedChatRoomId: string | null;
    setSelectedChatRoomId: (id: string | null) => void;
}

export const userMessageStore = create<MessageState>((set) => ({
    selectedChatRoomId: null,
    setSelectedChatRoomId: (id) => set({ selectedChatRoomId: id }),
}))