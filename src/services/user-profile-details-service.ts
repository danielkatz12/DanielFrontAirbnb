import apiClient, {axiosConfig} from "./api-client"

import {UserDetailsData} from "../stateManagement/RecoilState.ts";


export const saveNewUserProfileDetails = (newUserProfileDetails: UserDetailsData) => {
    return new Promise<UserDetailsData>((resolve, reject) => {
        console.log("Saving new user profile details...")
        console.log(newUserProfileDetails)
        apiClient.post("/user.profile.details", newUserProfileDetails, axiosConfig).then((response) => {
            console.log("save on then: ", response)
            resolve(response.data)
        }).catch((error) => {
            console.log("save on catch: ", error)
            reject(error)
        })
    })

}


