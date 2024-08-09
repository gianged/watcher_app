import "./Login.scss"
import React from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";

export const Login = (): React.ReactElement => {
    return (
        <>
            <Container className={"mt-5"}>
                <Row className={"justify-content-center login-row"}>
                    <Col className={"col-md-6 login-col"}>
                        <Tabs defaultActiveKey={"login"} id={"login-tabs"} className={"mb-3 login-tabs"}>
                            <Tab eventKey={"login"} title={"Login"}>
                                <Form>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type={"text"} placeholder={"Username"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type={"password"} placeholder={"Password"} />
                                    </Form.Group>
                                    <Button variant={"primary"} type={"submit"}>
                                        Login
                                    </Button>
                                </Form>
                            </Tab>
                            <Tab eventKey={"register"} title={"Register"}>
                                <Form>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type={"text"} placeholder={"Username"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type={"password"} placeholder={"Password"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type={"password"} placeholder={"Confirm Password"} />
                                    </Form.Group>
                                    <Button variant={"primary"} type={"submit"}>
                                        Register
                                    </Button>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
