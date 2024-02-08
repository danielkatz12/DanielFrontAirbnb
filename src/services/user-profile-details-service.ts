import apiClient, {axiosConfig} from "./api-client"

import {UserDetailsData} from "../stateManagement/RecoilState.ts";


export const saveNewUserProfileDetails = (newUserProfileDetails: UserDetailsData) => {
    return new Promise<UserDetailsData>((resolve, reject) => {
        console.log("Saving new user profile details...")
        console.log(newUserProfileDetails)
        apiClient.post("/user-profile-details", newUserProfileDetails, axiosConfig).then((response) => {
            console.log("saved user-profile details successfully: ", response)
            resolve(response.data)
        }).catch((error) => {
            console.log("failed to save user-profile details: ", error)
            reject(error)
        })
    })

}

export const updateUserProfileDetails = (userProfileDetailsToUpdate: UserDetailsData) => {
    return new Promise<UserDetailsData>((resolve, reject) => {
        console.log("Updating user profile details...")
        console.log(userProfileDetailsToUpdate);
        apiClient.put(`/user-profile-details/user/${userProfileDetailsToUpdate.user}`, userProfileDetailsToUpdate, axiosConfig).then((response) => {
            console.log("updated user-profile details successfully: ", response)
            resolve(response.data)
        }).catch((error) => {
            console.log("failed to update user-profile details: ", error)
            reject(error)
        })
    })

}

export const getAllUserProfileDetails = () => {
    return new Promise<UserDetailsData[]>((resolve, reject) => {
        console.log("get all user profile details...")
        apiClient.get(`/user-profile-details/`, axiosConfig).then((response) => {
            console.log("get all user profile details successfully: ", response)
            resolve(response.data)
        }).catch((error) => {
            console.log("failed to get all user profile details: ", error)
            reject(error)
        })
    })

}

export const getMyUserProfileDetails = (userId: string) : Promise<UserDetailsData> => {
    return new Promise<UserDetailsData>((resolve, reject) => {
        console.log("get My user profile details...")
        apiClient.get(`/user-profile-details/user/${userId}`, axiosConfig).then((response) => {
            console.log("got My user profile details successfully: ", response)
            resolve(response.data)
        }).catch((error) => {
            console.log("failed to get all user profile details: ", error)
            reject(error)
        })
    })

}


