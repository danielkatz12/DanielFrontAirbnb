import React from 'react';
import {Card, Container, Button} from 'react-bootstrap';
import {currentDisplayedComponentState, UserDetailsData} from "../stateManagement/RecoilState.ts";
import avatar from "../assets/avatar.jpeg";
import {useRecoilState} from "recoil";
import UserProfileDetailsForm from "./UserProfileDetailsForm.tsx";
import PostsList from "./PostsList.tsx";

interface MyProfileProps {
    userProfileDetails: UserDetailsData
}

function MyProfile({userProfileDetails}: MyProfileProps) {
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);

    console.log("My Profile: ", userProfileDetails)
    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Card style={{width: '35rem'}}>
                <Card.Img variant="top"
                          src={userProfileDetails.profileImage ? userProfileDetails.profileImage : avatar}/>
                <Card.Body>
                    <Card.Title>{userProfileDetails.name}</Card.Title>
                    <Card.Text>
                        <strong>Contact Email:</strong> {userProfileDetails.contactEmail}
                        <br/>
                        <strong>Phone Number:</strong> {userProfileDetails.contactPhoneNumber}
                        <br/>
                        <strong>Age:</strong> {userProfileDetails.age}
                    </Card.Text>
                    <Button variant="primary" onClick={() => {setCurrDisplayedComp(<UserProfileDetailsForm isInRegistrationMode={false}/>)}}>Edit My Profile</Button>{' '}
                    <Button variant="danger" onClick={() => {setCurrDisplayedComp(<PostsList/>)}}>Close</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MyProfile;