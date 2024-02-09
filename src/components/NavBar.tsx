import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";

function NavBar() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Your Welcome To Airbnb Website</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#all-posts">All Posts List</Nav.Link>
                    <Nav.Link href="#my-profile">My Profile</Nav.Link>
                    <Nav.Link href="#all-my-posts">All My Posts List</Nav.Link>
                    <Nav.Link href="#add-new-post">Add New Post</Nav.Link>
                    <NavDropdown title="Special" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#login">Login</NavDropdown.Item>
                        <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
