import React, {useState} from 'react';
import {PostItemData} from "./PostItem.tsx";
import avatar from "../assets/avatar.jpeg";
import ReviewForm from "./ReviewForm.tsx";

export interface PostDisplayProps {
    post: PostItemData;
}

function PostDisplay({post}: PostDisplayProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    return (
        <div>
            <div>
                {/*<h1>owner: {post.user.userProfileDetails.name} </h1>*/}
                {/*<h2>Price($): {post.pricePerDay}</h2>*/}
                {/*<h2>Street number: {post.street}</h2>*/}
                {/*<h2>Street number: {post.streetNumber}</h2>*/}
                {/*<h2>Reviews number: {post.reviewCounts}</h2>*/}
                <h2>Description: {post.description}</h2>
                <img src={post.imageUrl} alt={avatar}/>
            </div>
            <div className="d-flex justify-content-center position-relative">
                <button type="button" onClick={(event) => {setIsReviewOpen(!isReviewOpen); event.currentTarget.value = "Close"}}
                        className="btn btn btn-primary">Add Review
                </button>
            </div>
            <div>{isReviewOpen && <ReviewForm postId={post._id}/>}</div>
        </div>
    );
}

export default PostDisplay;
