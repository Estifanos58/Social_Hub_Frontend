/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        id\n        email\n        firstname\n        avatarUrl\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n  ) {\n    register(\n      registerInput: {\n        email: $email\n        firstname: $firstname\n        lastname: $lastname\n        password: $password\n      }\n    ) {\n      user {\n        id\n        firstname\n        email\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n      mutation ResetPassword(\n        $token: String!, \n        $newPassword: String!\n        ) {\n    resetPassword(\n        token: $token, \n        newPassword: $newPassword\n        ) {\n        user {\n            id\n            firstname\n            email\n            bio\n            avatarUrl\n        }\n    }\n  }\n": typeof types.ResetPasswordDocument,
    "\n    mutation SendResetCode($email: String!) {\n        forgotPassword(email: $email) \n    }\n": typeof types.SendResetCodeDocument,
    "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      user {\n        id\n        firstname\n        email\n        bio\n        avatarUrl\n      }\n    }\n  }\n": typeof types.VerifyEmailDocument,
    "\n    mutation DeletePost($postId: String!) {\n        deletePost(postId: $postId)}": typeof types.DeletePostDocument,
    "\n    mutation UpdateProfile($firstname: String, $lastname: String, $bio: String, $avatarUrl: String, $isPrivate: Boolean, $twoFactorEnabled: Boolean) {\n        UpdateUser(updateUser: {firstname: $firstname, lastname: $lastname, bio: $bio, avatarUrl: $avatarUrl, isPrivate: $isPrivate, twoFactorEnabled: $twoFactorEnabled}) {\n            id\n            email\n            firstname\n            lastname\n            bio\n            avatarUrl\n            isPrivate\n        }\n    }\n": typeof types.UpdateProfileDocument,
    "\n  query GetMe {\n    getme {\n        id\n        email\n        firstname\n        lastname\n        avatarUrl\n        lastSeenAt\n        createdAt\n        updatedAt\n        verified\n        isPrivate\n        bio\n    }\n  }\n": typeof types.GetMeDocument,
};
const documents: Documents = {
    "\n  mutation Login($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        id\n        email\n        firstname\n        avatarUrl\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n  ) {\n    register(\n      registerInput: {\n        email: $email\n        firstname: $firstname\n        lastname: $lastname\n        password: $password\n      }\n    ) {\n      user {\n        id\n        firstname\n        email\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n      mutation ResetPassword(\n        $token: String!, \n        $newPassword: String!\n        ) {\n    resetPassword(\n        token: $token, \n        newPassword: $newPassword\n        ) {\n        user {\n            id\n            firstname\n            email\n            bio\n            avatarUrl\n        }\n    }\n  }\n": types.ResetPasswordDocument,
    "\n    mutation SendResetCode($email: String!) {\n        forgotPassword(email: $email) \n    }\n": types.SendResetCodeDocument,
    "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      user {\n        id\n        firstname\n        email\n        bio\n        avatarUrl\n      }\n    }\n  }\n": types.VerifyEmailDocument,
    "\n    mutation DeletePost($postId: String!) {\n        deletePost(postId: $postId)}": types.DeletePostDocument,
    "\n    mutation UpdateProfile($firstname: String, $lastname: String, $bio: String, $avatarUrl: String, $isPrivate: Boolean, $twoFactorEnabled: Boolean) {\n        UpdateUser(updateUser: {firstname: $firstname, lastname: $lastname, bio: $bio, avatarUrl: $avatarUrl, isPrivate: $isPrivate, twoFactorEnabled: $twoFactorEnabled}) {\n            id\n            email\n            firstname\n            lastname\n            bio\n            avatarUrl\n            isPrivate\n        }\n    }\n": types.UpdateProfileDocument,
    "\n  query GetMe {\n    getme {\n        id\n        email\n        firstname\n        lastname\n        avatarUrl\n        lastSeenAt\n        createdAt\n        updatedAt\n        verified\n        isPrivate\n        bio\n    }\n  }\n": types.GetMeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        id\n        email\n        firstname\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        id\n        email\n        firstname\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n  ) {\n    register(\n      registerInput: {\n        email: $email\n        firstname: $firstname\n        lastname: $lastname\n        password: $password\n      }\n    ) {\n      user {\n        id\n        firstname\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register(\n    $firstname: String!\n    $lastname: String!\n    $email: String!\n    $password: String!\n  ) {\n    register(\n      registerInput: {\n        email: $email\n        firstname: $firstname\n        lastname: $lastname\n        password: $password\n      }\n    ) {\n      user {\n        id\n        firstname\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation ResetPassword(\n        $token: String!, \n        $newPassword: String!\n        ) {\n    resetPassword(\n        token: $token, \n        newPassword: $newPassword\n        ) {\n        user {\n            id\n            firstname\n            email\n            bio\n            avatarUrl\n        }\n    }\n  }\n"): (typeof documents)["\n      mutation ResetPassword(\n        $token: String!, \n        $newPassword: String!\n        ) {\n    resetPassword(\n        token: $token, \n        newPassword: $newPassword\n        ) {\n        user {\n            id\n            firstname\n            email\n            bio\n            avatarUrl\n        }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendResetCode($email: String!) {\n        forgotPassword(email: $email) \n    }\n"): (typeof documents)["\n    mutation SendResetCode($email: String!) {\n        forgotPassword(email: $email) \n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      user {\n        id\n        firstname\n        email\n        bio\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      user {\n        id\n        firstname\n        email\n        bio\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeletePost($postId: String!) {\n        deletePost(postId: $postId)}"): (typeof documents)["\n    mutation DeletePost($postId: String!) {\n        deletePost(postId: $postId)}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateProfile($firstname: String, $lastname: String, $bio: String, $avatarUrl: String, $isPrivate: Boolean, $twoFactorEnabled: Boolean) {\n        UpdateUser(updateUser: {firstname: $firstname, lastname: $lastname, bio: $bio, avatarUrl: $avatarUrl, isPrivate: $isPrivate, twoFactorEnabled: $twoFactorEnabled}) {\n            id\n            email\n            firstname\n            lastname\n            bio\n            avatarUrl\n            isPrivate\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateProfile($firstname: String, $lastname: String, $bio: String, $avatarUrl: String, $isPrivate: Boolean, $twoFactorEnabled: Boolean) {\n        UpdateUser(updateUser: {firstname: $firstname, lastname: $lastname, bio: $bio, avatarUrl: $avatarUrl, isPrivate: $isPrivate, twoFactorEnabled: $twoFactorEnabled}) {\n            id\n            email\n            firstname\n            lastname\n            bio\n            avatarUrl\n            isPrivate\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    getme {\n        id\n        email\n        firstname\n        lastname\n        avatarUrl\n        lastSeenAt\n        createdAt\n        updatedAt\n        verified\n        isPrivate\n        bio\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    getme {\n        id\n        email\n        firstname\n        lastname\n        avatarUrl\n        lastSeenAt\n        createdAt\n        updatedAt\n        verified\n        isPrivate\n        bio\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;