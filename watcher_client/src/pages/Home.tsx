import {
    faBell,
    faBuilding,
    faBullhorn,
    faHome,
    faSignOutAlt,
    faTicketAlt,
    faUser,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import "./Home.scss"
import { Button, Container, Image, Modal, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";

export const Home = (): React.ReactElement => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newTicketCount = 5; // changing it soon
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const {logout} = useContext(AuthenticateContext);

    const userProfilePicture = user?.profilePicture || "/default_pfp.png";

    return (
        <>
            <div className={"home-container"}>
                <Navbar className={"top-navbar"} expand={"lg"}>
                    <Container fluid>
                        <Navbar.Brand as={Link} to={"/app"} className={"brand"}>MyApp</Navbar.Brand>
                        <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
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
                                    <Image src={userProfilePicture}
                                           roundedCircle
                                           width={"30"}
                                           height={"30"}
                                           className={"d-inline-block align-top avatar-image"}
                                    />
                                }
                                             id={"basic-nav-dropdown"}
                                             align={"end"}>
                                    <NavDropdown.Item as={Link} to={"/app/profile"}>
                                        <FontAwesomeIcon icon={faUser} className={"me-2"} />
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => setShowLogoutModal(true)}>
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
                        <Nav id={"basic-sidebar-nav"} defaultActiveKey={"/app"} variant={"pills"}
                             className={"flex-column"}>
                            <Nav.Link as={Link} to={"/app"} active={location.pathname === "/app"}>
                                <FontAwesomeIcon icon={faHome} className={"me-2"} />
                                Dashboard
                            </Nav.Link>
                            {user?.roleLevel > 0 && user?.roleLevel <= 2 && (
                                <>
                                    <Nav.Link as={Link} to={"/app/departments"}
                                              active={location.pathname === "/app/departments"}>
                                        <FontAwesomeIcon icon={faBuilding} className={"me-2"} />
                                        Department Manage
                                    </Nav.Link>
                                </>
                            )}
                            {user?.roleLevel > 0 && user?.roleLevel <= 3 && (
                                <>
                                    <Nav.Link as={Link} to={"/app/users"} active={location.pathname === "/app/users"}>
                                        <FontAwesomeIcon icon={faUsers} className={"me-2"} />
                                        User Manage
                                    </Nav.Link>
                                    <Nav.Link as={Link} to={"/app/announces"} active={location.pathname === "/app/announces"}>
                                        <FontAwesomeIcon icon={faBullhorn} className={"me-2"} />
                                        Announcements
                                    </Nav.Link>
                                    <Nav.Link as={Link} to={"/app/tickets"} active={location.pathname === "/app/tickets"}>
                                        <FontAwesomeIcon icon={faTicketAlt} className={"me-2"} />
                                        Ticket Manage
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </div>
                    <div className={"content"}>
                        <Outlet />
                    </div>
                </div>
            </div>

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={logout}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
