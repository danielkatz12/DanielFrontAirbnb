import {atom, useSetRecoilState} from 'recoil';
import {ReactElement} from 'react';
import {
    getAccessTokenFromLocalStorage,
    getIdTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage
} from "../services/token-service.ts";
import {PostItemData} from "../components/PostItem.tsx";
import {UserReview} from "../services/reviews-service.ts";
import {AlertData} from "../components/AlertMessage.tsx";


// Interface for UserDetails
export interface UserDetailsData {
    name: string;
    user?: string
    contactEmail?: string;
    contactPhoneNumber?: number;
    age?: number;
    profileImage?: string;
}

// Atom for UserDetails
export const userDetailsState = atom<UserDetailsData>({
    key: 'userDetailsState',
    default: {
        name: '',
        user: '',
        contactEmail: undefined,
        contactPhoneNumber: undefined,
        age: undefined
    }
});


export const accessTokenState = atom<string | undefined>({
    key: 'accessTokenState',
    default: getAccessTokenFromLocalStorage() ?? undefined
});

export const refreshTokenState = atom<string | undefined>({
    key: 'refreshTokenState',
    default: getRefreshTokenFromLocalStorage() ?? undefined
});

export const idTokenState = atom<string | undefined>({
    key: 'idTokenState',
    default: getIdTokenFromLocalStorage() ?? undefined
});

export const fullPostsState = atom<PostItemData[]>({
    key: 'fullPostsState',
    default: []
});

export const allPostsReviews = atom<UserReview[]>({
    key: 'allPostsReviews',
    default: []
});

export const alertState = atom<AlertData>({
    key: 'alertState',
    default: {
        message: null,
        variant: "success"
    }
})
