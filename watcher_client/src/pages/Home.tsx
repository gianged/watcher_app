import React from "react";
import "./Home.scss"
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export const Home = (): React.ReactElement => {
    return (
        <>
            <div className={"home-container"}>
                <Navbar className={"top-navbar"} expand={"lg"}>
                    <Container fluid>
                        <Navbar.Toggle aria-controls={"basic-sidebar-nav"} />
                        <Navbar.Collapse id={"basic-navbar-nav"} className={"justify-content-end"}>
                            <Nav>
                                <NavDropdown title={
                                    <Image src={"/"}
                                           roundedCircle
                                           width={"30"}
                                           height={"30"}
                                           className={"d-inline-block align-top avatar-image"}
                                    />
                                }
                                             id={"basic-nav-dropdown"}
                                             align={"end"}>
                                    <NavDropdown.Item as={Link} to={"/home"}>Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to={"/home"}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <div className={"d-flex"}>
                    <div className={"sidebar"}>
                        <Nav id={"basic-sidebar-nav"} defaultActiveKey={"/home"} variant={"pills"}
                             className={"flex-column"}>
                            <Nav.Link as={Link} to={"/home"} active={true}>Home</Nav.Link>
                            <Nav.Link as={Link} to={"/home"}>User Manage</Nav.Link>
                            <Nav.Link as={Link} to={"/home"}>Home 3</Nav.Link>
                            <Nav.Link as={Link} to={"/home"}>Home 4</Nav.Link>
                            <Nav.Link as={Link} to={"/home"}>Home 5</Nav.Link>
                        </Nav>
                    </div>
                    <Container>
                        <Outlet />
                    </Container>
                </div>
            </div>
        </>
    )
}
