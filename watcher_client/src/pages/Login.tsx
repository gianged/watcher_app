import "./Login.scss"
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useCallback, useContext, useState } from "react";
import { Alert, Button, Col, Container, Form, OverlayTrigger, Row, Tab, Tabs, Tooltip } from "react-bootstrap";
import authenticateApi from "../api/AuthenticateApi.ts";
import { AuthenticateContext } from "../providers/AuthenticateProvider.tsx";

export const Login = (): React.ReactElement => {

    //region Login hooks

    const {login, loginError} = useContext(AuthenticateContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login(username, password);
    }

    //endregion

    //region Register hooks

    const [registerUsername, setRegisterUsername] = useState<string>('');
    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
    const [registerError, setRegisterError] = useState<string | null>('');

    const validatePassword = useCallback(() => {
        if (registerPassword !== registerConfirmPassword) {
            setRegisterError('Passwords do not match');
            return false;
        }
        if (registerPassword.length < 8) {
            setRegisterError('Password must be at least 8 characters long');
            return false;
        }
        setRegisterError(null);
        return true;
    }, [registerPassword, registerConfirmPassword]);

    const handleRegister = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validatePassword()) {
            const response = await authenticateApi.register(registerUsername, registerPassword);
            if (response.success) {
                await login(registerUsername, registerPassword);
            } else {
                setRegisterError(response.message);
            }
        }
    }, [validatePassword, registerUsername, registerPassword, login])

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
                                <Form onSubmit={async (e: FormEvent) => {
                                    await handleRegister(e);
                                }}>
                                    {registerError && <Alert variant={"danger"}>{registerError}</Alert>}
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Username</Form.Label>
                                        <Form.Control type={"text"}
                                                      value={registerUsername}
                                                      onChange={(e) => setRegisterUsername(e.target.value)}
                                                      placeholder={"Username"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>
                                            Password
                                            <OverlayTrigger placement={"right"} overlay={
                                                <Tooltip id={"password-tooltip"}>Passwords must be at least 8 characters
                                                    long</Tooltip>
                                            }>
                                                <FontAwesomeIcon icon={faQuestionCircle} className={"ms-2"} />
                                            </OverlayTrigger>
                                        </Form.Label>
                                        <Form.Control type={"password"}
                                                      value={registerPassword}
                                                      onChange={(e) => setRegisterPassword(e.target.value)}
                                                      placeholder={"Password"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Confirm Password</Form.Label>
                                        <Form.Control type={"password"}
                                                      value={registerConfirmPassword}
                                                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                                      placeholder={"Confirm Password"} />
                                    </Form.Group>
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
