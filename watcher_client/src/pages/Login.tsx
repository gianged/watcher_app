import "./Login.scss"
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import AuthenticateApi from "../api/AuthenticateApi.ts";
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

    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [registerUsername, setRegisterUsername] = useState<string>('');
    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
    const [registerError, setRegisterError] = useState<string | null>(null);

    const validateRegisterFields = async (): Promise<boolean> => {
        if (!registerUsername) {
            setRegisterError('Username is required');
            return false;
        } else if (!registerPassword) {
            setRegisterError('Password is required');
            return false;
        } else if (!registerConfirmPassword) {
            setRegisterError('Confirm Password is required');
            return false;
        } else if (registerPassword !== registerConfirmPassword) {
            setRegisterError('Passwords do not match');
            return false;
        } else if (registerPassword.length < 8) {
            setRegisterError('Password must be at least 8 characters long');
            return false;
        } else if (await AuthenticateApi.checkUsername(registerUsername)) {
            setRegisterError('Username already exists');
            return false;
        } else {
            setRegisterError(null);
            return true;
        }
    };

    useEffect(() => {
        if (formSubmitted) {
            const timeoutId = setTimeout(validateRegisterFields, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [registerUsername, registerPassword, registerConfirmPassword, formSubmitted]);

    const handleRegister = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        const isValid = await validateRegisterFields();
        if (isValid) {
            const response = await authenticateApi.register(registerUsername, registerPassword);
            if (response.success) {
                await login(registerUsername, registerPassword);
            } else {
                setRegisterError(response.message);
            }
        }
    }, [registerUsername, registerPassword, login])

    //endregion

    return (
        <>
            <div className="login-page">
                <Container className={"login-container"}>
                    <Row className={"justify-content-center login-row"}>
                        <Col className={"col-md-8 login-col"}>
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
                                    {registerError && <Alert variant={"danger"}>{registerError}</Alert>}
                                    <Form onSubmit={handleRegister}>
                                        <Form.Group className={"mb-3"}>
                                            <Form.Label column={"sm"}>Username</Form.Label>
                                            <Form.Control type={"text"} placeholder={"Username"}
                                                          value={registerUsername}
                                                          onChange={(e) => setRegisterUsername(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className={"mb-3"}>
                                            <Form.Label column={"sm"}>Password</Form.Label>
                                            <Form.Control type={"password"} placeholder={"Password"}
                                                          value={registerPassword}
                                                          onChange={(e) => setRegisterPassword(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className={"mb-3"}>
                                            <Form.Label column={"sm"}>Confirm Password</Form.Label>
                                            <Form.Control type={"password"} placeholder={"Confirm Password"}
                                                          value={registerConfirmPassword}
                                                          onChange={(e) => setRegisterConfirmPassword(e.target.value)} />
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
            </div>
        </>
    )
}
