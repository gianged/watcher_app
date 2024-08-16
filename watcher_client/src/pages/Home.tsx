import React from "react";
import "./Home.scss"
import { Container, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export const Home = (): React.ReactElement => {
    return (
        <>
            <div className={"d-flex"}>
                <div className={"sidebar"}>
                    <Nav defaultActiveKey={"/home"} variant={"pills"} className={"flex-column"}>
                        <Nav.Link as={Link} to={"/home"}>Home</Nav.Link>
                        <Nav.Link as={Link} to={"/home"}>Home 2</Nav.Link>
                        <Nav.Link as={Link} to={"/home"}>Home 3</Nav.Link>
                        <Nav.Link as={Link} to={"/home"}>Home 4</Nav.Link>
                        <Nav.Link as={Link} to={"/home"}>Home 5</Nav.Link>
                    </Nav>
                </div>
                <Container>
                    <Outlet />
                </Container>
            </div>
        </>
    )
}
