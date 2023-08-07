import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Icon from "./Icon";

function DatePicker({ selectedDate, setSelectedDate }) {
    return (
        <Container width="50%">
            <Row style={{ verticalAlign: "middle" }}>
                <Col
                    style={{ display: "grid", alignItems: "center" }}
                    align="left"
                    onClick={() => {
                        var tomorrow = new Date(
                            selectedDate.getTime() + 24 * 60 * 60 * 1000
                        );
                        setSelectedDate(tomorrow);
                    }}
                >
                    <Icon icon="fa-caret-right fa-2xl" />
                </Col>
                <Col className="auto">
                    <Form.Control
                        style={{ backgroundColor: "transparent" }}
                        type="date"
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={(event) => {
                            setSelectedDate(new Date(event.target.value));
                        }}
                    />
                </Col>
                <Col
                    style={{ display: "grid", alignItems: "center" }}
                    align="right"
                    onClick={() => {
                        var yesterday = new Date(
                            selectedDate.getTime() - 24 * 60 * 60 * 1000
                        );
                        setSelectedDate(yesterday);
                    }}
                >
                    <Icon icon="fa-caret-left fa-2xl" />
                </Col>
            </Row>
        </Container>
    );
}

export default DatePicker;
