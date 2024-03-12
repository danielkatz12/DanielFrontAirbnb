import apiClient from "./api-client";
import {AxiosError} from "axios";

interface IUpoloadResponse {
    url: string;
}

export const uploadPhoto = async (photo: File) => {
    return new Promise<string>((resolve, reject) => {
        console.log("Uploading photo..." + photo)
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            apiClient.post<IUpoloadResponse>('file?file=123.jpeg', formData, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            }).then(res => {
                console.log(res);
                resolve(res.data.url);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }
    });
}

export const deletePhoto = async (imageUrl: string) => {
    return new Promise<void>((resolve, reject) => {
        console.log("Deleting photo with the urs: " + imageUrl);
        apiClient.delete("/file/delete-file?fileUrl=" + encodeURIComponent(imageUrl)).then((response) => {
            console.log("Photo deleted successfully: ", response)
            resolve();
        }).catch((error) => {
            console.log("failed to delete photo: ", error)
            reject(error)
        })
    })
}

export const updatePhoto = async (oldImageUrl: string, newImageFile: File) => {
    try {
        await deletePhoto(oldImageUrl); // Delete old photo
        const newImageUrl = await uploadPhoto(newImageFile); // Upload new photo
        console.log("Image updated successfully");
        return newImageUrl; // Resolve with the new image URL
    } catch (error) {
        if (error instanceof AxiosError  && error.response && error.response.status === 404)
            throw new Error("404");
        console.error("Failed to update the image:", error);
        throw error; // Propagate the error to the caller
    }
}

