/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Types of Roles in the chat room */
export enum ChatRoomRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export type ChatroomDto = {
  __typename?: 'ChatroomDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isGroup: Scalars['Boolean']['output'];
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChatroomUserDto = {
  __typename?: 'ChatroomUserDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isMuted: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastReadAt?: Maybe<Scalars['DateTime']['output']>;
  role: ChatRoomRole;
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type CommentDto = {
  __typename?: 'CommentDto';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  parent?: Maybe<CommentDto>;
  parentId?: Maybe<Scalars['String']['output']>;
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  replies?: Maybe<Array<CommentDto>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCommentDto = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
};

export type CreateCommentResponse = {
  __typename?: 'CreateCommentResponse';
  comment?: Maybe<CommentDto>;
};

export type CreatePostDto = {
  content: Scalars['String']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FollowerDto = {
  __typename?: 'FollowerDto';
  createdAt: Scalars['DateTime']['output'];
  follower?: Maybe<UserDto>;
  followerId: Scalars['String']['output'];
  following?: Maybe<UserDto>;
  followingId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type GetPostType = {
  __typename?: 'GetPostType';
  comments?: Maybe<Array<CommentDto>>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetUsersToFollowDto = {
  __typename?: 'GetUsersToFollowDto';
  hasMore: Scalars['Boolean']['output'];
  users: Array<UserDto>;
};

export type LoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageDto = {
  __typename?: 'MessageDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isEdited: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  UnfollowUser: Scalars['String']['output'];
  UpdateUser: UserDto;
  createComment: CreateCommentResponse;
  createPost: Scalars['String']['output'];
  deletePost: Scalars['String']['output'];
  followUser: Scalars['String']['output'];
  forgotPassword: Scalars['String']['output'];
  login: UserResponse;
  logout: Scalars['String']['output'];
  register: UserResponse;
  resetPassword: UserResponse;
  verifyEmail: UserResponse;
};


export type MutationUnfollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  updateUser: UpdateUserDto;
};


export type MutationCreateCommentArgs = {
  createCommentInput: CreateCommentDto;
};


export type MutationCreatePostArgs = {
  createPost: CreatePostDto;
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginDto;
};


export type MutationRegisterArgs = {
  registerInput: RegisterDto;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type PaginatedPostsDto = {
  __typename?: 'PaginatedPostsDto';
  hasMore: Scalars['Boolean']['output'];
  posts: Array<PostFeedDto>;
};

export type Post = {
  __typename?: 'Post';
  comments: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Scalars['Float']['output'];
};

export type PostDto = {
  __typename?: 'PostDto';
  comments?: Maybe<Array<CommentDto>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PostFeedDto = {
  __typename?: 'PostFeedDto';
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PostImageDto = {
  __typename?: 'PostImageDto';
  id: Scalars['String']['output'];
  postId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetUser: UserProfileDto;
  GetUsersToFollow: GetUsersToFollowDto;
  getPost: GetPostType;
  getPosts: PaginatedPostsDto;
  getme: UserDto;
};


export type QueryGetUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUsersToFollowArgs = {
  limit: Scalars['Float']['input'];
  offset: Scalars['Float']['input'];
};


export type QueryGetPostArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetPostsArgs = {
  cursor: Scalars['String']['input'];
  take: Scalars['Float']['input'];
};

export type ReactionDto = {
  __typename?: 'ReactionDto';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  type: ReactionType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Types of reactions a user can make on a post */
export enum ReactionType {
  Angry = 'ANGRY',
  Haha = 'HAHA',
  Like = 'LIKE',
  Love = 'LOVE',
  Sad = 'SAD',
  Wow = 'WOW'
}

export type RegisterDto = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateUserDto = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDto = {
  __typename?: 'UserDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  chatroomsCreated?: Maybe<Array<ChatroomDto>>;
  comments?: Maybe<Array<CommentDto>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  followers?: Maybe<Array<FollowerDto>>;
  following?: Maybe<Array<FollowerDto>>;
  id: Scalars['String']['output'];
  isPrivate: Scalars['Boolean']['output'];
  lastSeenAt?: Maybe<Scalars['DateTime']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  posts?: Maybe<Array<PostDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserProfileDto = {
  __typename?: 'UserProfileDto';
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  posts?: Maybe<Array<Post>>;
  user: UserDto;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<UserDto>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, email: string, firstname: string, avatarUrl?: string | null } | null } };

export type RegisterMutationVariables = Exact<{
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, firstname: string, email: string } | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, firstname: string, email: string, bio?: string | null, avatarUrl?: string | null } | null } };

export type SendResetCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetCodeMutation = { __typename?: 'Mutation', forgotPassword: string };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, firstname: string, email: string, bio?: string | null, avatarUrl?: string | null } | null } };

export type CreatePostMutationVariables = Exact<{
  content: Scalars['String']['input'];
  imageUrls: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: string };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: string };

export type UpdateProfileMutationVariables = Exact<{
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', UpdateUser: { __typename?: 'UserDto', id: string, email: string, firstname: string, lastname?: string | null, bio?: string | null, avatarUrl?: string | null, isPrivate: boolean } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getme: { __typename?: 'UserDto', id: string, email: string, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null, createdAt: any, updatedAt: any, verified: boolean, isPrivate: boolean, bio?: string | null } };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', GetUser: { __typename?: 'UserProfileDto', followers?: number | null, following?: number | null, user: { __typename?: 'UserDto', avatarUrl?: string | null, firstname: string, lastname?: string | null, bio?: string | null, email: string, isPrivate: boolean }, posts?: Array<{ __typename?: 'Post', id: string, imageUrl: string, likes: number, comments: number }> | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registerInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendResetCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendResetCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendResetCodeMutation, SendResetCodeMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrls"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createPost"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"imageUrls"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrls"}}}]}}]}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bio"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPrivate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twoFactorEnabled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"bio"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bio"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isPrivate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPrivate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"twoFactorEnabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twoFactorEnabled"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Types of Roles in the chat room */
export enum ChatRoomRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export type ChatroomDto = {
  __typename?: 'ChatroomDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isGroup: Scalars['Boolean']['output'];
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChatroomUserDto = {
  __typename?: 'ChatroomUserDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isMuted: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastReadAt?: Maybe<Scalars['DateTime']['output']>;
  role: ChatRoomRole;
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type CommentDto = {
  __typename?: 'CommentDto';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  parent?: Maybe<CommentDto>;
  parentId?: Maybe<Scalars['String']['output']>;
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  replies?: Maybe<Array<CommentDto>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCommentDto = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
};

export type CreateCommentResponse = {
  __typename?: 'CreateCommentResponse';
  comment?: Maybe<CommentDto>;
};

export type CreatePostDto = {
  content: Scalars['String']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FollowerDto = {
  __typename?: 'FollowerDto';
  createdAt: Scalars['DateTime']['output'];
  follower?: Maybe<UserDto>;
  followerId: Scalars['String']['output'];
  following?: Maybe<UserDto>;
  followingId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type GetPostType = {
  __typename?: 'GetPostType';
  comments?: Maybe<Array<CommentDto>>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GetUsersToFollowDto = {
  __typename?: 'GetUsersToFollowDto';
  hasMore: Scalars['Boolean']['output'];
  users: Array<UserDto>;
};

export type LoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageDto = {
  __typename?: 'MessageDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isEdited: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  UnfollowUser: Scalars['String']['output'];
  UpdateUser: UserDto;
  createComment: CreateCommentResponse;
  createPost: Scalars['String']['output'];
  deletePost: Scalars['String']['output'];
  followUser: Scalars['String']['output'];
  forgotPassword: Scalars['String']['output'];
  login: UserResponse;
  logout: Scalars['String']['output'];
  register: UserResponse;
  resetPassword: UserResponse;
  verifyEmail: UserResponse;
};


export type MutationUnfollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  updateUser: UpdateUserDto;
};


export type MutationCreateCommentArgs = {
  createCommentInput: CreateCommentDto;
};


export type MutationCreatePostArgs = {
  createPost: CreatePostDto;
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginDto;
};


export type MutationRegisterArgs = {
  registerInput: RegisterDto;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type PaginatedPostsDto = {
  __typename?: 'PaginatedPostsDto';
  hasMore: Scalars['Boolean']['output'];
  posts: Array<PostFeedDto>;
};

export type Post = {
  __typename?: 'Post';
  comments: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Scalars['Float']['output'];
};

export type PostDto = {
  __typename?: 'PostDto';
  comments?: Maybe<Array<CommentDto>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PostFeedDto = {
  __typename?: 'PostFeedDto';
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PostImageDto = {
  __typename?: 'PostImageDto';
  id: Scalars['String']['output'];
  postId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetUser: UserProfileDto;
  GetUsersToFollow: GetUsersToFollowDto;
  getPost: GetPostType;
  getPosts: PaginatedPostsDto;
  getme: UserDto;
};


export type QueryGetUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUsersToFollowArgs = {
  limit: Scalars['Float']['input'];
  offset: Scalars['Float']['input'];
};


export type QueryGetPostArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetPostsArgs = {
  cursor: Scalars['String']['input'];
  take: Scalars['Float']['input'];
};

export type ReactionDto = {
  __typename?: 'ReactionDto';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  type: ReactionType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Types of reactions a user can make on a post */
export enum ReactionType {
  Angry = 'ANGRY',
  Haha = 'HAHA',
  Like = 'LIKE',
  Love = 'LOVE',
  Sad = 'SAD',
  Wow = 'WOW'
}

export type RegisterDto = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateUserDto = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDto = {
  __typename?: 'UserDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  chatroomsCreated?: Maybe<Array<ChatroomDto>>;
  comments?: Maybe<Array<CommentDto>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  followers?: Maybe<Array<FollowerDto>>;
  following?: Maybe<Array<FollowerDto>>;
  id: Scalars['String']['output'];
  isPrivate: Scalars['Boolean']['output'];
  lastSeenAt?: Maybe<Scalars['DateTime']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  posts?: Maybe<Array<PostDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserProfileDto = {
  __typename?: 'UserProfileDto';
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  posts?: Maybe<Array<Post>>;
  user: UserDto;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<UserDto>;
};
