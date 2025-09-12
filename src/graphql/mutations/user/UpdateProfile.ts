import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($firstname: String, $lastname: String, $bio: String, $avatarUrl: String, $isPrivate: Boolean, $twoFactorEnabled: Boolean) {
        UpdateUser(updateUser: {firstname: $firstname, lastname: $lastname, bio: $bio, avatarUrl: $avatarUrl, isPrivate: $isPrivate, twoFactorEnabled: $twoFactorEnabled}) {
            id
            email
            firstname
            lastname
            bio
            avatarUrl
            isPrivate
        }
    }
`;
