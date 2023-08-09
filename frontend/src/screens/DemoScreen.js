import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import { createBasicUser } from "../actions/userManagmentActions";
import Title from "../components/Title";
import Loader from "../components/Loader";
import Message from "../components/Message";

function DemoScreen() {
    const dispatch = useDispatch();

    const basicUserCreate = useSelector((state) => state.basicUserCreate);
    const { loading, error, success } = basicUserCreate;

    const [dataChanges, setDataChanges] = useState(false);
    const [dataPosted, setDataPosted] = useState(false);

    useEffect(() => {
        if (error) {
            setDataPosted(false);
        }
    }, [error]);

    return (
        <Container>
            <Form
                dir="rtl"
                onSubmit={(e) => {
                    e.preventDefault();
                    setDataPosted(true);
                    dispatch(
                        createBasicUser({
                            first_name:
                                document.getElementById(`firstNameInput`).value,
                            last_name:
                                document.getElementById(`lastNameInput`).value,
                            email: document.getElementById(`emailInput`).value,
                        })
                    );
                }}
            >
                <Row align="center">
                    <Title>יצירת משתמש דמו</Title>
                </Row>
                <Row>
                    <Col align="center">
                        <Form.Group as={Row}>
                            <Form.Label column sm={3}>
                                שם פרטי
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    id={`firstNameInput`}
                                    style={{
                                        width: "100%",
                                    }}
                                    required={true}
                                    onChange={() => {
                                        setDataChanges(true);
                                    }}
                                    disabled={dataPosted}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm={3}>
                                שם משפחה
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    id={`lastNameInput`}
                                    style={{
                                        width: "100%",
                                    }}
                                    required={true}
                                    onChange={() => setDataChanges(true)}
                                    disabled={dataPosted}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm={3}>
                                דוא"ל
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    id={`emailInput`}
                                    style={{
                                        width: "100%",
                                    }}
                                    required={true}
                                    onChange={() => setDataChanges(true)}
                                    disabled={dataPosted}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            type="submit"
                            variant="success"
                            disabled={!dataChanges || dataPosted}
                        >
                            צור משתמש
                        </Button>
                    </Col>
                    <Col>
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant="danger">{error}</Message>
                        ) : dataPosted && success ? (
                            <Message variant="success">
                                המשתמש נוצר - אנא התחבר למערכת
                            </Message>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default DemoScreen;
