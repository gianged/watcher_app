import "./Login.scss"
import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";

export const Login = (): React.ReactElement => {

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
                            <Tab eventKey={"login"} title={"Login"}>
                                <Form>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Username</Form.Label>
                                        <Form.Control type={"text"} placeholder={"Username"} />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"}>
                                        <Form.Label column={"sm"}>Password</Form.Label>
                                        <Form.Control type={"password"} placeholder={"Password"} />
                                    </Form.Group>
                                    <Button className={"formButton"} variant={"primary"} type={"submit"}>
                                        Login
                                    </Button>
                                </Form>
                            </Tab>
                            <Tab eventKey={"register"} title={"Register"}>
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
                                        <Form.Text className={"text-danger error-text"}>{registerPasswordError}</Form.Text>}
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
