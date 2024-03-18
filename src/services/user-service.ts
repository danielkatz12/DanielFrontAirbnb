import apiClient from "./api-client"
import {CredentialResponse} from "@react-oauth/google";
import {
    getRefreshTokenFromLocalStorage,
    saveAccessTokenInLocalStorage,
    saveRefreshTokenInLocalStorage
} from "./token-service.ts";
import {AxiosError} from "axios";

export interface IUser {
    email: string,
    password?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export interface Tokens {
    accessToken: string,
    refreshToken: string
}
export const registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user...")
        console.log(user)
        apiClient.post("/auth/register", user).then((response) => {
            console.log("User has been registered successfully")
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const loginUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Login user request to server... user: ", user);
        apiClient.post("/auth/login", user).then((response) => {
            console.log("User is login successfully")
            resolve(response.data);
        }).catch((error) => {
            if (error instanceof AxiosError  && error.response && error.response.status === 401)
            {
                console.error("email or password incorrect", error);
                reject(new Error("401"));
            }
            console.log("Failed to login the user");
            reject(error);
        })

    })
}

export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("googleSignin ...")
        apiClient.post("/auth/google", credentialResponse).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export function useRefreshToken(): Promise<Tokens> {

    return new Promise<Tokens>((resolve, reject) => {
        console.log("about to get new refresh and access token...")
        apiClient.get('/auth/refresh', {
            headers: {
                'Authorization': `Bearer ${getRefreshTokenFromLocalStorage()}`
            }
        }).then(response => {
            console.log("refresh tokens successfully!")

            saveRefreshTokenInLocalStorage(response.data.refreshToken);
            saveAccessTokenInLocalStorage(response.data.accessToken);
            console.log("saved new tokens in local storage..")
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export function logoutFromServer(): Promise<void>{
    return new Promise<void>((resolve, reject) => {
        console.log("about to logout from server...");
        apiClient.get('/auth/logout', {
            headers: {
                'Authorization': `Bearer ${getRefreshTokenFromLocalStorage()}`
            }
        }).then(response => {
            console.log("User logout successfully!")
            resolve(response.data)
        }).catch((error) => {
            console.log("Failed to logout... error: ",error)
            reject(error)
        })
    })
}
