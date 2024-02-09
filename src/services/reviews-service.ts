import apiClient, {axiosConfig} from "./api-client.ts";
import {UserDetailsData} from "../stateManagement/RecoilState.ts";

export interface ReviewDto {
    comment: string;
    post: string;
}

export interface UserReview {
    _id: string
    comment: string
    post: string
    userProfileDetails: UserDetailsData
}

export function insertReview(reviewDto: ReviewDto): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        console.log(`Inserting new review for post with ${(reviewDto.post)}`)
        apiClient.post("/review", reviewDto, axiosConfig).then((response) => {
            console.log("Review saved successfully: ", response)
            resolve();
        }).catch((error) => {
            console.log("failed to insert Review: ", error)
            reject(error)
        })
    })
}

export function getReviewsByPostId(postId: string): Promise<UserReview[]> {
    return new Promise<UserReview[]>((resolve, reject) => {
        console.log(`Fetching reviews for postr with ${(postId)}`)
        apiClient.post("/review/get-post-reviews", {postId: postId}, axiosConfig).then((response) => {
            console.log("Fetch reviews has been successfully: ", response)
            resolve(response.data);
        }).catch((error) => {
            console.log("Failed to fetch reviews: ", error)
            reject(error)
        })
    })

}
