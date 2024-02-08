import apiClient, {axiosConfig} from "./api-client.ts";

export function getAllCities() {
    return new Promise<string[]>((resolve, reject) => {
        console.log("fetching all cities...")
        apiClient.post<string[]>("/gov/getAllCities", axiosConfig).then((response) => {
            console.log("fetch cities successfully: ", response)
            resolve(response.data);
        }).catch((error) => {
            console.log("failed to fetch cities: ", error)
            reject(error)
        })
    })
}
