import React, {useEffect, useState} from 'react';
import {PostItemData} from "./PostItem.tsx";
import avatar from "../assets/avatar.jpeg";
import ReviewForm from "./ReviewForm.tsx";
import {getReviewsByPostId, UserReview} from "../services/reviews-service.ts";
import {Button, Card} from 'react-bootstrap';
import '../css/PostDisplay.css';

export interface PostDisplayProps {
    post: PostItemData;
}

function PostDisplay({post}: PostDisplayProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [allPostReviews, setAllPostReviews] = useState<UserReview[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1)

    useEffect(() => {
        getReviewsByPostId(post._id)
            .then(value => {
                    console.log("load all post's reviews from server successfuly: ", value);
                    setAllPostReviews([...value]);
                }
            )
            .catch((error) => console.log("failed to load all post's reviews from server..."));
    }, []);
    return (
        <div>
            <div className="full-post-details-container">
                <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile"/>
                <div className="post-details">
                    <Card className="post-card">
                        <Card.Body>
                            <Card.Title>{post.user.userProfileDetails.name}</Card.Title>
                            <Card.Text>
                                <strong>Price:</strong> ${post.pricePerDay}
                                <br/>
                                <strong>Location:</strong> {post.city}, {post.street}, {post.streetNumber}
                                <br/>
                                <strong>Reviews:</strong> {post.reviewCounts}
                                <br/>
                                <strong>Description:</strong> {post.description}
                                <br/>
                                <strong>Seller Contact Email:</strong> {post.user.userProfileDetails.contactEmail}
                                <br/>
                                <strong>Seller Phone Number:</strong> {post.user.userProfileDetails.contactPhoneNumber}
                            </Card.Text>
                            <Button variant="primary">Delete Post</Button>
                        </Card.Body>
                        <div className="card-image-container">
                            <img className="card-image" src={post.imageUrl} alt="Apartment"/>
                        </div>
                    </Card>
                </div>
            </div>
            <div>
                <div style={{ marginBottom: "100px"}}></div>
                <div ><Card.Title>All Reviews</Card.Title></div>

                <div className="full-post-details-container">
                    <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile"/>
                    <div className="post-details">
                        <Card className="post-card">
                            <Card.Body>
                                <Card.Title>Reviewer: {post.user.userProfileDetails.name}</Card.Title>
                                <Card.Text>
                                    <strong>comment:</strong> {post.description}
                                    <br/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <div className="full-post-details-container">
                    <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile"/>
                    <div className="post-details">
                        <Card className="post-card">
                            <Card.Body>
                                <Card.Title>Reviewer: {post.user.userProfileDetails.name}</Card.Title>
                                <Card.Text>
                                    <strong>comment:</strong> {post.description}
                                    <br/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>


                {/*<div className="reviews-section">*/}
                {/*    <h2>User Reviews</h2>*/}
                {/*    <ul className="review-list">*/}
                {/*        {allPostReviews.map((review, index) => (*/}
                {/*            <li key={index} className="review-item">*/}
                {/*                <img className="reviewer-image" src={review.userProfileDetails.profileImage} alt="Reviewer Profile" />*/}
                {/*                <div className="review-details">*/}
                {/*                    <p className="reviewer-name">{review.userProfileDetails.name}</p>*/}
                {/*                    <p className="review-comment">{review.comment}</p>*/}
                {/*                </div>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*    <Button variant="primary">Add New Review</Button>*/}
                {/*</div>*/}
            </div>
        </div>

        // <div className="full-post-details-container">
        //     <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile" />
        //     <div className="post-details">
        //         <Card className="post-card">
        //             <div className="card-image-container">
        //                 <img className="card-image" src={post.imageUrl} alt="Apartment" />
        //             </div>
        //             <Card.Body>
        //                 <Card.Title>{post.user.userProfileDetails.name}</Card.Title>
        //                 <Card.Text>
        //                     <strong>Price:</strong> ${post.pricePerDay}
        //                     <br />
        //                     <strong>Location:</strong> {post.city}, {post.street}, {post.streetNumber}
        //                     <br />
        //                     <strong>Reviews:</strong> {post.reviewCounts}
        //                     <br />
        //                     <strong>Description:</strong> {post.description}
        //                     <br />
        //                     <strong>Seller Contact Email:</strong> {post.user.userProfileDetails.contactEmail}
        //                     <br />
        //                     <strong>Seller Phone Number:</strong> {post.user.userProfileDetails.contactPhoneNumber}
        //                 </Card.Text>
        //                 <Button variant="primary">Contact Seller</Button>
        //             </Card.Body>
        //         </Card>
        //     </div>
        // </div>

        // <div className="full-post-details-container">
        //     <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile" />
        //     <div className="post-details">
        //         <Card className="post-card">
        //             <div className="card-image-container">
        //                 <img className="card-image" src={post.imageUrl} alt="Apartment" />
        //             </div>
        //             <Card.Body>
        //                 <Card.Title>{post.user.userProfileDetails.name}</Card.Title>
        //                 <Card.Text>
        //                     <strong>Price:</strong> ${post.pricePerDay}
        //                     <br />
        //                     <strong>Location:</strong> {post.city}, {post.street}, {post.streetNumber}
        //                     <br />
        //                     <strong>Reviews:</strong> {post.reviewCounts}
        //                     <br />
        //                     <strong>Description:</strong> {post.description}
        //                     <br />
        //                     <strong>Seller Contact Email:</strong> {post.user.userProfileDetails.contactEmail}
        //                     <br />
        //                     <strong>Seller Phone Number:</strong> {post.user.userProfileDetails.contactPhoneNumber}
        //                 </Card.Text>
        //                 <Button variant="primary">Contact Seller</Button>
        //             </Card.Body>
        //         </Card>
        //     </div>
        // </div>

    );
}

// <div className="full-post-details-container">
//     <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile" />
//     <div className="post-details">
//         <Card className="post-card">
//             <Card.Body>
//                 <Card.Title>{post.user.userProfileDetails.name}</Card.Title>
//                 <Card.Text>
//                     <strong>Price:</strong> ${post.pricePerDay}
//                     <br />
//                     <strong>Location:</strong> {post.city}, {post.street}, {post.streetNumber}
//                     <br />
//                     <strong>Reviews:</strong> {post.reviewCounts}
//                     <br />
//                     <strong>Description:</strong> {post.description}
//                     <br />
//                     <strong>Seller Contact Email:</strong> {post.user.userProfileDetails.contactEmail}
//                     <br />
//                     <strong>Seller Phone Number:</strong> {post.user.userProfileDetails.contactPhoneNumber}
//                 </Card.Text>
//                 <Button variant="primary">Contact Seller</Button>
//             </Card.Body>
//         </Card>
//     </div>
// </div>


// <div className="full-post-details-container">
//     <Card className="post-card">
//         <Card.Img className="post-image" variant="top" src={post.imageUrl} />
//         <Card.Body>
//             <Card.Title>Seller: {post.user.userProfileDetails.name}</Card.Title>
//             <Card.Text>
//                 <strong>Price Per Day:</strong> ${post.pricePerDay}
//                 <br />
//                 <strong>Location:</strong> {post.city}, {post.street}, {post.streetNumber}
//                 <br />
//                 <strong>Reviews:</strong> {post.reviewCounts}
//                 <br />
//                 <strong>Description:</strong> {post.description}
//                 <br />
//                 <strong>Seller Contact Email:</strong> {post.user.userProfileDetails.contactEmail}
//                 <br />
//                 <strong>Seller Phone Number:</strong> {post.user.userProfileDetails.contactPhoneNumber}
//             </Card.Text>
//             <Button variant="primary">Contact Seller</Button>
//         </Card.Body>
//     </Card>
//     <div className="seller-details">
//         <img className="profile-image" src={post.user.userProfileDetails.profileImage} alt="Seller Profile" />
//         <span>{post.user.userProfileDetails.name}</span>
//     </div>
// </div>
// <div>
//     <div>
//         <h1>owner: {post.user.userProfileDetails.name} </h1>
//         <h2>Price Per Day($): {post.pricePerDay}</h2>
//         <h2>Street: {post.street}</h2>
//         <h2>Street number: {post.streetNumber}</h2>
//         <h2>Reviews number: {post.reviewCounts}</h2>
//         <h2>Description: {post.description}</h2>
//         <img src={post.imageUrl} alt={avatar}/>
//     </div>
//     <div className="d-flex justify-content-center position-relative">
//         <button type="button" onClick={(event) => {
//             setIsReviewOpen(!isReviewOpen);
//             event.currentTarget.value = "Close"
//         }}
//                 className="btn btn btn-primary">Add Review
//         </button>
//     </div>
//     <div>
//         {/*{allPostReviews.map((value) => <div>{`${value.comment}`}</div>)}*/}
//         <ul className="list-group">
//             {allPostReviews.length == 0 && <p>No Items...</p>}
//             {allPostReviews.map((item, index) =>
//                 <li className={(selectedIndex == index) ? "list-group-item active" : "list-group-item"}
//                     onClick={() => setSelectedIndex(index)}
//                     key={index}>
//                     {<button/>}
//                 </li>)}
//         </ul>
//     </div>
//     <div>{isReviewOpen && <ReviewForm postId={post._id}/>}</div>
// </div>

export default PostDisplay;
