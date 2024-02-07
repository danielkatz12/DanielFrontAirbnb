import apiClient from "./api-client"
import {CredentialResponse} from "@react-oauth/google";

export interface IUser {
    email: string,
    password?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export const registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user...")
        console.log(user)
        apiClient.post("/auth/register", user).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}
// export const registerUser = (standardRegistration: StandardRegistration) => {
//     return new Promise<User>((resolve, reject) => {
//         console.log("Registering user...")
//         console.log(standardRegistration)
//         apiClient.post("/auth/register", standardRegistration).then((response) => {
//             console.log(response)
//             resolve(response.data)
//         }).catch((error) => {
//             console.log(error)
//             reject(error)
//         })
//     })
// }

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
