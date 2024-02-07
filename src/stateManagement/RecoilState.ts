import { atom } from 'recoil';
import { ReactElement } from 'react';
import {
    getAccessTokenFromLocalStorage,
    getIdTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage
} from "../services/token-service.ts";

// Interface for UserDetails
export interface UserDetailsData {
    name: string;
    userId: string
    contactEmail?: string;
    contactPhoneNumber?: string;
    age?: number;
    profileImage?: string;
}

// // Interface for Tokens
// export interface Tokens {
//     accessToken?: string;
//     refreshToken?: string;
//     idToken?: string;
// }



// Atom for UserDetails
export const userDetailsState = atom<UserDetailsData>({
    key: 'userDetailsState',
    default: {
        name: '',
        userId: '',
        contactEmail: undefined,
        contactPhoneNumber: undefined,
        age: undefined
    }
});

// // Atom for Tokens
// export const tokensState = atom<Tokens>({
//     key: 'tokensState',
//     default: {
//         accessToken: getAccessTokenFromLocalStorage() ?? undefined,
//         refreshToken: getRefreshTokenFromLocalStorage() ?? undefined,
//         idToken: getIdTokenFromLocalStorage() ?? undefined
//     }
// });


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

// Atom for Current component
export const currentDisplayedComponentState = atom<ReactElement | null>({
    key: 'currentDisplayedComponentState',
    default: null
});
