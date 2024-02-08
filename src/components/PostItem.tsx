import {IUser} from "../services/user-service.ts";
import {currentDisplayedComponentState, UserDetailsData} from "../stateManagement/RecoilState.ts";
import avatar from "../assets/avatar.jpeg";
import {useRecoilState} from "recoil";
import PostDisplay from "./PostDisplay.tsx";
import PostForm from "./PostForm.tsx";

export interface PostItemData {
    _id: string
    city: string;
    street: string;
    streetNumber: number;
    description: string;
    imageUrl: string;
    pricePerDay: number;
    user: IUser & { userProfileDetails: UserDetailsData };
    reviewCounts: number
    //userProfileDetails:UserDetailsData;
}

interface PostProps {
    post: PostItemData
}

function PostItem({post}: PostProps) {
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);

    return (
        <div>
            <div>
                <h1>owner: {post.user.userProfileDetails.name} </h1>
                <h2>Price($): {post.pricePerDay}</h2>
                <h2>City: {post.city}</h2>
                <h2>Street number: {post.street}</h2>
                <h2>Street number: {post.streetNumber}</h2>
                <h2>Reviews number: {post.reviewCounts}</h2>
                <h2>Discription: {post.description}</h2>
                <img src={post.imageUrl} alt={avatar}/>
            </div>
            <div className="d-flex justify-content-center position-relative">
                <button type="button" onClick={() => setCurrDisplayedComp(<PostDisplay key={post._id} post={post}/>)}
                        className="btn btn btn-primary">Display Post
                </button>
            </div>
        </div>
    )
}

export default PostItem
