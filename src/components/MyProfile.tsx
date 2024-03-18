import React from 'react';
import {Button, Card, Container} from 'react-bootstrap';
import {UserDetailsData} from "../stateManagement/RecoilState.ts";
import avatar from "../assets/avatar.jpeg";
import {useNavigate} from "react-router-dom";

interface MyProfileProps {
    userProfileDetails: UserDetailsData
}

function MyProfile({userProfileDetails}: MyProfileProps) {

    const navigate = useNavigate();

    console.log("My Profile: ", userProfileDetails)
    return (
        <Container className="vh-80 d-flex justify-content-center align-items-center">
            <Card style={{width: '25rem', marginTop:'2rem'}}>
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
                    <Button variant="primary" onClick={() => {navigate("/user-details")}}>Edit My Profile</Button>{' '}
                    <Button variant="danger" onClick={() => {navigate("/")}}>Close</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MyProfile;
