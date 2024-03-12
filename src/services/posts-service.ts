import apiClient from "./api-client"

import {PostItemData} from "../components/PostItem.tsx"
import {PostDto} from "../dtos/post-dto.ts";


export function getAllFullPosts() {
    const abortController = new AbortController()
    const req = apiClient.get<PostItemData[]>('post/get-all', {signal: abortController.signal})
    return {req, abort: () => abortController.abort()}
}

export function insertPost(postDto: PostDto): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        console.log("inserting new post")
        console.log(postDto)
        apiClient.post("/post", postDto).then((response) => {
            console.log("Post saved successfully: ", response)
            resolve();
        }).catch((error) => {
            console.log("failed to insert Post: ", error)
            reject(error)
        })
    })
}

export function updatePost(postDto: PostDto): Promise<PostDto> {
    return new Promise<PostDto>((resolve, reject) => {
        console.log("Updating post: ", postDto);
        apiClient.put(`/post/${postDto._id}`, postDto).then((response) => {
            console.log("Post saved successfully: ", response)
            resolve(response.data);
        }).catch((error) => {
            console.log("failed to update Post: ", error)
            reject(error)
        })
    })
}

export function deletePostById(postId: string): Promise<PostDto> {
    return new Promise<PostDto>((resolve, reject) => {
        console.log("deleting post with id: ", postId);
        apiClient.delete(`/post/${postId}`).then((response) => {
            console.log("Post deleted successfuly: ", response);
            resolve(response.data);
        }).catch((error) => {
            console.log("Failed to delete Post: ", error);
            reject(error);
        })
    })
}
