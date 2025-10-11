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


export type MessageEdge = {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  };
  chatroom?: {
    id: string;
    name?: string | null;
    isGroup: boolean;
    avatarUrl?: string | null;
    updatedAt?: string | null;
    memberships?: Array<{
      userId: string;
      user?: {
        id: string;
        firstname: string;
        lastname?: string | null;
        avatarUrl?: string | null;
      } | null;
    }>;
  } | null;
};

export interface ChatroomLastMessage {
  id: string;
  content?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  user?: {
    id: string;
    firstname: string;
    lastname?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface ChatroomListItem {
  id: string;
  isGroup: boolean;
  name: string;
  avatarUrl: string;
  routeId: string;
  lastMessage: ChatroomLastMessage | null;
  lastActivityAt: string;
}

export const DEFAULT_AVATAR = '/noAvatar.png';

export interface ChatroomMeta {
  id: string | null;
  isGroup: boolean;
  name: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
}

export interface ChatroomMemberDetail {
  id: string;
  userId: string;
  firstname?: string | null;
  lastname?: string | null;
  avatarUrl?: string | null;
  isOwner: boolean;
}

export interface ChatroomDirectUserDetail {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  email: string;
  totalFollowers: number;
  totalFollowing: number;
}

export interface ChatroomDetail {
  id: string;
  isGroup: boolean;
  name?: string | null;
  avatarUrl?: string | null;
  totalMessages: number;
  totalPhotos: number;
  totalMembers?: number | null;
  members?: ChatroomMemberDetail[] | null;
  directUser?: ChatroomDirectUserDetail | null;
}