import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Row, Col, Form, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import Title from "../components/utils/Title";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import { createBasicUser } from "../slices/users/userBasicCreateSlice";

function DemoScreen() {
    const dispatch = useAppDispatch();

    const userCreateOrUpdate = useAppSelector((state) => state.userCreateOrUpdate);
    const { status, error } = userCreateOrUpdate;

    const [dataChanged, setDataChanged] = useState(false);
    const [dataPosted, setDataPosted] = useState(false);

    // in case of error, enable the user to post data again
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
                            firstName: (
                                document.getElementById(`firstNameInput`) as HTMLInputElement
                            ).value,
                            lastName: (document.getElementById(`lastNameInput`) as HTMLInputElement)
                                .value,
                            email: (document.getElementById(`emailInput`) as HTMLInputElement)
                                .value,
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
                                        setDataChanged(true);
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
                                    onChange={() => setDataChanged(true)}
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
                                    onChange={() => setDataChanged(true)}
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
                            disabled={!dataChanged || dataPosted}
                        >
                            צור משתמש
                        </Button>
                    </Col>
                    <Col>
                        {status === "loading" ? (
                            <Loader />
                        ) : error ? (
                            <Message variant="danger">{error}</Message>
                        ) : dataPosted && status === "success" ? (
                            <Message variant="success">המשתמש נוצר - אנא התחבר למערכת</Message>
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
