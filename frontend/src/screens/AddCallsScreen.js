import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
    Button,
    Card,
    Col,
    Collapse,
    Container,
    Form,
    Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import JSONPretty from "react-json-pretty";
import JSONTheme from "react-json-pretty/themes/acai.css";

import Title from "../components/Title";
import RestrictedComponent from "../components/RestrictedComponent";
import { ADD_MY_CALLS_PERMISSION } from "../constants/userAuthConstants";
import { addCalls, getAddCallExample } from "../actions/callAction";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AddCallsScreen() {
    const dispatch = useDispatch();
    const addCallExample = useSelector((state) => state.addCallExample);
    const {
        jsonExample,
        loading: jsonExampleLoading,
        error: jsonExampleError,
    } = addCallExample;
    const addCall = useSelector((state) => state.addCall);
    const {
        loading: addCallLoading,
        error: addCallError,
        success: addCallSuccess,
    } = addCall;
    const fileInputRef = useRef(null);
    const [jsonInput, setJsonInput] = useState(null);
    const [jsonExampleOpen, setJsonExampleOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);

    const readJsonFileContent = (file) => {
        if (!file.type.endsWith("json")) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            setJsonInput(event.target.result);
        });
        reader.readAsText(file);
    };

    useEffect(() => {
        dispatch(getAddCallExample());
    }, [dispatch]);

    useEffect(() => {
        if (addCallSuccess) {
            setJsonInput(null);
            fileInputRef.current.value = null;
        }
    }, [addCallSuccess]);

    return (
        <RestrictedComponent requiredPermission={ADD_MY_CALLS_PERMISSION}>
            <Container style={{ width: "100%" }}>
                <Row align="center">
                    <Title>הוספת קריאות</Title>
                </Row>
                <Row className="mb-3">
                    הוספת ועדכון קריאות אמורים להתבצע באופן שוטף באמצעות ה-API.
                    להפעלתו באופן ידני, יש לקלוט קובץ JSON.
                </Row>
                <Row className="my-3">
                    <Button
                        variant="dark"
                        onClick={() => setJsonExampleOpen(!jsonExampleOpen)}
                    >
                        דוגמא למבנה הקובץ
                    </Button>
                    <Collapse in={jsonExampleOpen} className="p-0">
                        <Card body>
                            {jsonExampleLoading ? (
                                <Loader />
                            ) : jsonExampleError ? (
                                <Message variant="danger">
                                    {jsonExampleError}
                                </Message>
                            ) : (
                                <JSONPretty
                                    id="json-example"
                                    width="100%"
                                    dir="ltr"
                                    space="2"
                                    theme={JSONTheme}
                                    data={jsonExample}
                                ></JSONPretty>
                            )}
                        </Card>
                    </Collapse>
                </Row>
                <Row className="my-3">
                    <Button
                        variant="dark"
                        onClick={() => setFormOpen(!formOpen)}
                    >
                        קליטת קובץ
                    </Button>
                    <Collapse in={formOpen}>
                        <Card body>
                            <Row>
                                <Form dir="rtl">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm={4}>
                                            קובץ JSON
                                        </Form.Label>
                                        <Col>
                                            <Form.Control
                                                id="file-form-control"
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json"
                                                onChange={(e) => {
                                                    readJsonFileContent(
                                                        e.target.files[0]
                                                    );
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant="success"
                                        disabled={
                                            jsonInput === null || addCallLoading
                                        }
                                        onClick={() =>
                                            dispatch(addCalls(jsonInput))
                                        }
                                    >
                                        הוסף קריאות
                                    </Button>
                                </Col>
                                <Col>
                                    {addCallLoading ? (
                                        <Loader size="40" />
                                    ) : addCallError ? (
                                        <Message variant="danger">
                                            {addCallError}
                                        </Message>
                                    ) : jsonInput === null && addCallSuccess ? (
                                        <Message variant="success">
                                            הקריאות נקלטו
                                        </Message>
                                    ) : (
                                        <></>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    </Collapse>
                </Row>
            </Container>
        </RestrictedComponent>
    );
}

export default AddCallsScreen;
