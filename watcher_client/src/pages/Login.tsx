import "./Login.scss"
import React, { FormEvent, useContext, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const Login = (): React.ReactElement => {

    //region Login

    const {login, loginError} = useContext(AuthenticateContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login(username, password);
    }

    //endregion

    //region Register

    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
    const [registerPasswordError, setRegisterPasswordError] = useState<string>('');

    const handleRegisterPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setRegisterPassword(input);
        validatePassword(input, registerConfirmPassword);
    }

    const handleRegisterConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setRegisterConfirmPassword(input);
        validatePassword(registerPassword, input);
    }

    const validatePassword = (password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setRegisterPasswordError('Passwords do not match');
        } else {
            setRegisterPasswordError('');
        }
    }

    //endregion

    return (
        <>
            <Container className={"login-container"}>
                <Row className={"justify-content-center login-row"}>
                    <Col className={"col-md-4 login-col"}>
                        <Tabs defaultActiveKey={"login"} id={"login-tabs"} className={"mb-3 login-tabs"} fill>
                            <Tab eventKey={"login"} title={
                                <>
                                    <FontAwesomeIcon icon={faSignInAlt} className={"me-2"} />
                                    Login
                                </>
                            }>
                                {loginError && <Alert variant={"danger"}>{loginError}</Alert>}
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Username</Form.Label>
                                        <Form.Control type={"text"} placeholder={"Username"}
                                                      value={username}
                                                      onChange={(e) => setUsername(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Password</Form.Label>
                                        <Form.Control type={"password"} placeholder={"Password"}
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)} />
                                    </Form.Group>
                                    <Button className={"formButton"} variant={"primary"} type={"submit"}>
                                        Login
                                    </Button>
                                </Form>
                            </Tab>
                            <Tab eventKey={"register"} title={
                                <>
                                    <FontAwesomeIcon icon={faUserPlus} className={"me-2"} />
                                    Register
                                </>
                            }>
                                <Form>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Username</Form.Label>
                                        <Form.Control type={"text"} placeholder={"Username"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Password</Form.Label>
                                        <Form.Control type={"password"}
                                                      value={registerPassword}
                                                      onChange={handleRegisterPasswordChange}
                                                      placeholder={"Password"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Confirm Password</Form.Label>
                                        <Form.Control type={"password"}
                                                      value={registerConfirmPassword}
                                                      onChange={handleRegisterConfirmPasswordChange}
                                                      placeholder={"Confirm Password"} />
                                    </Form.Group>
                                    {registerPasswordError &&
                                        <Form.Text
                                            className={"text-danger error-text"}>{registerPasswordError}</Form.Text>}
                                    <Button className={"formButton"} variant={"primary"} type={"submit"}>
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
