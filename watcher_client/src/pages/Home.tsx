import { faBell, faHome, faSignOutAlt, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Home.scss"
import { Container, Image, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export const Home = (): React.ReactElement => {
    const newTicketCount = 5; // changing it soon

    return (
        <>
            <div className={"home-container"}>
                <Navbar className={"top-navbar"} expand={"lg"}>
                    <Container fluid>
                        <Navbar.Toggle aria-controls={"basic-sidebar-nav"} />
                        <Navbar.Collapse id={"basic-navbar-nav"} className={"justify-content-end"}>
                            <Nav>
                                <Nav.Link href={"#"}>
                                    <OverlayTrigger
                                        placement={"bottom"}
                                        overlay={
                                            <Tooltip>{`You have ${newTicketCount} new ticket${newTicketCount > 1 ? "s" : ""}`}</Tooltip>
                                        }>
                                        <div className="icon-wrapper">
                                            <FontAwesomeIcon icon={faBell} className={"me-2"} />
                                            {newTicketCount > 0 && <span className="icon-badge">{newTicketCount}</span>}
                                        </div>
                                    </OverlayTrigger>
                                </Nav.Link>
                                <NavDropdown title={
                                    <Image src={"/default_pfp.png"}
                                           roundedCircle
                                           width={"30"}
                                           height={"30"}
                                           className={"d-inline-block align-top avatar-image"}
                                    />
                                }
                                             id={"basic-nav-dropdown"}
                                             align={"end"}>
                                    <NavDropdown.Item as={Link} to={"/home"}>
                                        <FontAwesomeIcon icon={faUser} className={"me-2"} />
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to={"/home"}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className={"me-2"} />
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <div className={"d-flex"}>
                    <div className={"sidebar"}>
                        <Nav id={"basic-sidebar-nav"} defaultActiveKey={"/home"} variant={"pills"}
                             className={"flex-column"}>
                            <Nav.Link as={Link} to={"/manage"} active={true}>
                                <FontAwesomeIcon icon={faHome} className={"me-2"} />
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to={"/home"}>
                                <FontAwesomeIcon icon={faUsers} className={"me-2"} />
                                User Manage
                            </Nav.Link>
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
