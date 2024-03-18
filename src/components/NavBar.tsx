import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import '../css/NavBar.css';
import {clearAllFromLocalStorage, getAccessTokenFromLocalStorage} from "../services/token-service.ts";
import {useRecoilState} from "recoil";
import {accessTokenState, idTokenState, refreshTokenState} from "../stateManagement/RecoilState.ts";
import {useNavigate} from "react-router-dom";
import {logoutFromServer} from "../services/user-service.ts";

function NavBar() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    const [idToken, setIdToken] = useRecoilState(idTokenState);

    const navigate = useNavigate();

    const logout = async () => {
        try {
            await logoutFromServer();
            clearAllFromLocalStorage();
            setAccessToken(undefined);
            setRefreshToken(undefined);
            setIdToken(undefined);
            navigate('/');
            console.log("user is now Logout");
            alert("user is now Logout");
        } catch (error) {
            console.log("Failed in logout");
            alert("Failed in logout");
        }
    }

    return (
        <div className="App">
            <Navbar bg="light" expand="lg" className="custom-navbar">
                <Navbar.Brand href="#home">Welcome To Airbnb Website</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">All Posts</Nav.Link>
                        {getAccessTokenFromLocalStorage() && <Nav.Link href="/my-profile">My Profile</Nav.Link>}
                        {getAccessTokenFromLocalStorage() && <Nav.Link href="/my-posts">All My Posts</Nav.Link>}
                        {getAccessTokenFromLocalStorage() &&<Nav.Link href="/add-post">Add Post</Nav.Link>}
                        <NavDropdown title="Account" id="basic-nav-dropdown">
                            {!getAccessTokenFromLocalStorage() &&
                                <NavDropdown.Item href="/login">Login</NavDropdown.Item> }
                            {!getAccessTokenFromLocalStorage() && <NavDropdown.Item href="/register">Registration</NavDropdown.Item>}
                            {getAccessTokenFromLocalStorage() && <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;//todo: check if there is an option to union tags with &&
