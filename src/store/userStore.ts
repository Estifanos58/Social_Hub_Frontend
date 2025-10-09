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
  isFollowing?: boolean;
    createdAt: string;
    updatedAt: string;

}

interface UserState {
  user: User | null;
  setUser: (input: User) => void;
  usersToFollow: User[];
  setUsersToFollow: (input: User[]) => void;
  removeUserFromToFollow: (userId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (input: User) => set({ user: input }),

  usersToFollow: [] as User[],
  setUsersToFollow: (input: User[]) => set({ usersToFollow: input }),
  removeUserFromToFollow: (userId: string) => set((state) => ({ usersToFollow: state.usersToFollow.filter(user => user.id !== userId) })),
}));