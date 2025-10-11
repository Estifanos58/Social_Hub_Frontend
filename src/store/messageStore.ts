import { create } from "zustand";
import { ChatroomListItem, ChatroomMeta } from "@/lib/types";

interface MessageState {
    selectedChatRoomId: string | null;
    selectedChatroomMeta: ChatroomMeta | null;
    chatrooms: ChatroomListItem[];
    isChatroomsLoading: boolean;
    setSelectedChatRoomId: (id: string | null) => void;
    setSelectedChatroomMeta: (meta: ChatroomMeta | null) => void;
    setChatrooms: (chatrooms: ChatroomListItem[]) => void;
    upsertChatroom: (chatroom: ChatroomListItem) => void;
    setChatroomsLoading: (loading: boolean) => void;
    clearChatrooms: () => void;
}

const sortChatrooms = (chatrooms: ChatroomListItem[]) =>
    [...chatrooms].sort((a, b) => {
        const aTime = new Date(a.lastActivityAt).getTime();
        const bTime = new Date(b.lastActivityAt).getTime();
        return bTime - aTime;
    });

export const userMessageStore = create<MessageState>((set) => ({
    selectedChatRoomId: null,
    selectedChatroomMeta: null,
    chatrooms: [],
    isChatroomsLoading: false,
    setSelectedChatRoomId: (id) => set({ selectedChatRoomId: id }),
    setSelectedChatroomMeta: (meta) => set({ selectedChatroomMeta: meta }),
    setChatrooms: (chatrooms) => set({ chatrooms: sortChatrooms(chatrooms) }),
    upsertChatroom: (chatroom) =>
        set((state) => {
            const existingIndex = state.chatrooms.findIndex((item) => item.id === chatroom.id);
            const updated = existingIndex >= 0
                ? state.chatrooms.map((item, index) => (index === existingIndex ? chatroom : item))
                : [chatroom, ...state.chatrooms];
            return { chatrooms: sortChatrooms(updated) };
        }),
    setChatroomsLoading: (loading) => set({ isChatroomsLoading: loading }),
    clearChatrooms: () => set({ chatrooms: [], selectedChatRoomId: null, selectedChatroomMeta: null }),
}));