import { create } from 'zustand';

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatarUrl?: string;
    lastSeenAt?: Date;
    bio?: string;
    verified?: boolean;
    isPrivate?: boolean;
    createdAt: string;
    updatedAt: string;

}

interface UserState {
  user: User | null;
  setUser: (input: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (input: User) => set({ user: input }),
}));