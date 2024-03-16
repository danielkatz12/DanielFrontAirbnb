import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card} from 'react-bootstrap';
import {PostItemData} from "./PostItem.tsx";
import {getUserIDFromLocalStorage} from "../services/token-service.ts";
import {useRecoilState} from "recoil";
import {allPostsReviews, fullPostsState} from "../stateManagement/RecoilState.ts";
import {getReviewsByPostId, UserReview} from "../services/reviews-service.ts";
import {deletePostById} from "../services/posts-service.ts";
import {useNavigate} from "react-router-dom";

interface PostDialogProps {
    onAddReview: () => void,
    onClosePostDialog: () => void,
    onEditPost: () => void,
    post: PostItemData
}

function PostDisplayDialog(props: PostDialogProps) {
    const [allPostReviewsState, setAllPostReviewsState] = useRecoilState<UserReview[]>(allPostsReviews);
    const [allPostsState, setAllPostsState] = useRecoilState(fullPostsState);

    const navigate = useNavigate();

    useEffect(() => {
        getReviewsByPostId(props.post._id).then(value => setAllPostReviewsState(value)).catch((error) => console.log("failed to load post's reviews from server")//todo:alart
        );
    }, []);

    async function deletePost() {
        try {
            console.log("post Id For Delete: ", props.post._id)
            await deletePostById(props.post._id);
            setAllPostsState(allPostsState.filter(value => value._id !== props.post._id));
            navigate("/");
            props.onClosePostDialog();
        } catch (error) {
            console.log("failed to delete the post....")//todo:alart
        }
    }

    function editPost() {
        props.onEditPost();
    }

    return (
        <div className="modal fade show" id="exampleModalToggle" aria-labelledby="exampleModalToggleLabel" tabIndex={-1}
             style={{display: "block"}} aria-modal={true} role={"dialog"}>
            <div className="modal-dialog modal-fullscreen  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Airbnb-Post</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={props.onClosePostDialog}></button>
                    </div>


                    <div className="modal-body" style={{height: '150%'}}>
                        <div>
                            <div className="full-post-details-container">
                                <img className="profile-image" src={props.post.user.userProfileDetails.profileImage}
                                     alt="Seller Profile"/>
                                <div className="post-details">
                                    <Card className="post-card">
                                        <Card.Body>
                                            <Card.Title>{props.post.user.userProfileDetails.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Price:</strong> ${props.post.pricePerDay}
                                                <br/>
                                                <strong>Location:</strong> {props.post.city}, {props.post.street}, {props.post.streetNumber}
                                                <br/>
                                                <strong>Reviews:</strong> {props.post.reviewCounts}
                                                <br/>
                                                <strong>Description:</strong> {props.post.description}
                                                <br/>
                                                <strong>Seller Contact
                                                    Email:</strong> {props.post.user.userProfileDetails.contactEmail}
                                                <br/>
                                                <strong>Seller Phone
                                                    Number:</strong> {props.post.user.userProfileDetails.contactPhoneNumber}
                                            </Card.Text>
                                            {getUserIDFromLocalStorage() && getUserIDFromLocalStorage() === props.post.user._id &&
                                                <Button variant="primary" onClick={deletePost}>Delete
                                                    Post</Button> //todo: getUserIDFromLocalStorage() into use effect??
                                            }
                                            {getUserIDFromLocalStorage() && getUserIDFromLocalStorage() === props.post.user._id &&
                                                <Button variant="primary" onClick={editPost}>Edit Post</Button>
                                            }
                                        </Card.Body>
                                        <div className="card-image-container">
                                            <img className="card-image" src={props.post.imageUrl} alt="Apartment"/>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            {/*<div>*/}
                            {/*    {allPostReviewsState.map(review =>*/}
                            {/*        <div className="full-post-details-container">*/}
                            {/*            <img className="profile-image"*/}
                            {/*                 src={review.userProfileDetails.profileImage}*/}
                            {/*                 alt="Seller Profile"/>*/}
                            {/*            <div className="post-details">*/}
                            {/*                <Card className="post-card">*/}
                            {/*                    <Card.Body>*/}
                            {/*                        <Card.Title>Reviewer: {review.userProfileDetails.name}</Card.Title>*/}
                            {/*                        <Card.Text>*/}
                            {/*                            <strong>comment:</strong> {review.comment}*/}
                            {/*                            <br/>*/}
                            {/*                        </Card.Text>*/}
                            {/*                    </Card.Body>*/}
                            {/*                </Card>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    <div className="modal-header mb-2"><h5 className="modal-title fs-6">All Post Reviews</h5></div>
                    <div className="modal-body">
                        <div>
                            {allPostReviewsState.map(review =>
                                <div className="full-post-details-container">
                                    <img className="profile-image"
                                         src={review.userProfileDetails.profileImage}
                                         alt="Seller Profile"/>
                                    <div className="post-details">
                                        <Card className="post-card">
                                            <Card.Body>
                                                <Card.Title>Reviewer: {review.userProfileDetails.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>comment:</strong> {review.comment}
                                                    <br/>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    {getUserIDFromLocalStorage() && <div className="modal-footer" style={{justifyContent: "center"}}>
                        <Button className="btn btn-primary" onClick={props.onAddReview}>Add New Review</Button>
                    </div>}
                </div>
            </div>
        </div>

    );
}

export default PostDisplayDialog;
