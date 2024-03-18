import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRecoilState} from "recoil";
import {alertState, userDetailsState} from "../stateManagement/RecoilState.ts";
import {insertReview, ReviewDto} from "../services/reviews-service.ts";
import AlertMessage from "./AlertMessage.tsx";

interface AddReviewDialogProps {
    onBackToPostDialog: () => void,
    postId: string
}

function AddReviewDialog(props: AddReviewDialogProps) {
    const [message, setMessage] = useState('');
    const [user] = useRecoilState(userDetailsState);
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);


    const handleAddMessage = async () => {
        // Handle adding the message here
        console.log('About to add message: ', message);

        try {
            await insertReview({post: props.postId, comment: message} as ReviewDto)
            console.log("saved new review successfully")
           setAlertPopup({message: "Thank you for your review!", variant:"success"})
            props.onBackToPostDialog();
        } catch (error) {
            console.log("Error in saving your review in system... error: ", error);
            setAlertPopup({message: "Error in saving your review in the system...", variant:"danger"});
        }
    }
    return (
        <div className="modal fade show" id="exampleModalToggle" aria-labelledby="exampleModalToggleLabel" tabIndex={-1}
             style={{display: "block"}} aria-modal={true} role={"dialog"}>
            <div className="modal-dialog modal-fullscreen modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header" style={{justifyContent:"flex-start"}}>
                        <img className="profile-image"
                        src={user.profileImage}
                        alt="Seller Profile"/>
                        <h1 className="modal-title fs-5">New Review</h1>
                        {/*<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>*/}
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                            <textarea className="form-control" id="message-text" style={{height: '30rem'}}
                                      value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer" style={{justifyContent:"center"}}>
                        <Button className="btn btn-primary" onClick={handleAddMessage}>Save Review</Button>
                        <Button className="btn btn-danger" onClick={props.onBackToPostDialog}>Cancel</Button>
                    </div>
                </div>
            </div>
            <AlertMessage/>
        </div>
    );

}

export default AddReviewDialog;
