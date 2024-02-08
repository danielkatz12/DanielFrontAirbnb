import {atom} from 'recoil';
import {ReactElement} from 'react';
import {
    getAccessTokenFromLocalStorage,
    getIdTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage
} from "../services/token-service.ts";
import {PostItemData} from "../components/PostItem.tsx";


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

// Atom for Current component
export const currentDisplayedComponentState = atom<ReactElement | null>({
    key: 'currentDisplayedComponentState',
    default: null
});
export const fullPostsState = atom<PostItemData[]>({
    key: 'fullPostsState',
    default: [
        {
            _id: "65c3e6ea029f42b7e026c848",
            city: "New York",
            street: "Broadway",
            streetNumber: 123,
            description: "Spacious apartment in the heart of the city",
            imageUrl: "http://example.com/image.jpg",
            pricePerDay: 150,
            user: {
                _id: "65c35915d41fa5c482a9034c",
                email: "danielkatz1212@gmail.com",
                userProfileDetails: {
                    name: "John Doe",
                    profileImage: "http://example.com/profile.jpg",
                    contactEmail: "john.doe@example.com",
                    contactPhoneNumber: 1234567890,
                    age: 30
                }
            },
            "reviewCounts": 1
        }
    ]
});
