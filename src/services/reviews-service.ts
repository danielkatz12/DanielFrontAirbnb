import apiClient, {axiosConfig} from "./api-client.ts";

interface ReviewDto {
    comment: string;
    post: string;
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
