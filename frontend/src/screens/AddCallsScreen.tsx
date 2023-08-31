import { useEffect, useRef } from "react";
import { useState } from "react";
import { Button, Card, Col, Collapse, Container, Form, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import JSONPretty from "react-json-pretty";
import JSONTheme from "react-json-pretty/themes/acai.css";

import Title from "../components/utils/Title";
import RestrictedComponent from "../components/utils/RestrictedComponent";
import { ADD_MY_CALLS_PERMISSION } from "../classes/permissions";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import { getAddCallsExample } from "../slices/calls/addCallsExampleSlice";
import { addCalls } from "../slices/calls/addCallsSlice";

function AddCallsScreen() {
    const dispatch = useAppDispatch();

    const addCallExample = useAppSelector((state) => state.addCallsExample);
    const { items, status: jsonExampleStatus, error: jsonExampleError } = addCallExample;
    const [jsonExample] = items;
    const [jsonExampleOpen, setJsonExampleOpen] = useState(false);

    const addCall = useAppSelector((state) => state.addCalls);
    const { status: addCallStatus, error: addCallError } = addCall;
    const [addCallFormOpen, setAddCallFormOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [jsonInput, setJsonInput] = useState<ArrayBuffer | string | null>(null);

    const readJsonFileContent = (file: File) => {
        if (!file.type.endsWith("json")) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            if (event.target !== null) {
                setJsonInput(event.target.result);
            }
        });
        reader.readAsText(file);
    };

    // loading json example
    useEffect(() => {
        dispatch(getAddCallsExample());
    }, [dispatch]);

    // successful calls addition -> ressing the input
    useEffect(() => {
        if (addCallStatus === "success") {
            setJsonInput(null);
            if (fileInputRef.current !== null) {
                fileInputRef.current.value = "";
            }
        }
    }, [addCallStatus]);

    return (
        <RestrictedComponent requiredPermission={ADD_MY_CALLS_PERMISSION}>
            <Container style={{ width: "100%" }}>
                <Row align="center">
                    <Title>הוספת קריאות</Title>
                </Row>
                <Row className="mb-3">
                    הוספת ועדכון קריאות אמורים להתבצע באופן שוטף באמצעות ה-API. להפעלתו באופן ידני,
                    יש לקלוט קובץ JSON.
                </Row>
                <Row className="my-3">
                    <Button variant="dark" onClick={() => setJsonExampleOpen(!jsonExampleOpen)}>
                        דוגמא למבנה הקובץ
                    </Button>
                    <Collapse in={jsonExampleOpen} className="p-0">
                        <Card body>
                            {jsonExampleStatus === "loading" ? (
                                <Loader />
                            ) : jsonExampleError ? (
                                <Message variant="danger">{jsonExampleError}</Message>
                            ) : (
                                <JSONPretty
                                    id="json-example"
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
                    <Button variant="dark" onClick={() => setAddCallFormOpen(!addCallFormOpen)}>
                        קליטת קובץ
                    </Button>
                    <Collapse in={addCallFormOpen}>
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
                                                    const files = (e.target as HTMLInputElement)
                                                        .files;
                                                    if (files !== null) {
                                                        readJsonFileContent(files[0]);
                                                    }
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
                                        disabled={jsonInput === null || addCallStatus === "loading"}
                                        onClick={() => dispatch(addCalls(jsonInput as string))}
                                    >
                                        הוסף קריאות
                                    </Button>
                                </Col>
                                <Col>
                                    {addCallStatus === "loading" ? (
                                        <Loader size={40} />
                                    ) : addCallError ? (
                                        <Message variant="danger">{addCallError}</Message>
                                    ) : jsonInput === null && addCallStatus === "success" ? (
                                        <Message variant="success">הקריאות נקלטו</Message>
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
