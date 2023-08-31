import { Dispatch, SetStateAction } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

import Icon from "./Icon";

interface DatePickerProps {
    selectedDate: Date,
    setSelectedDate: Dispatch<SetStateAction<Date>>
}

function DatePicker({ selectedDate, setSelectedDate } : DatePickerProps) {
    const getDateInFewDays = (startDate : Date, daysDiff : number) =>
        new Date(startDate.getTime() + daysDiff * 24 * 60 * 60 * 1000);

    return (
        <Container>
            <Row style={{ verticalAlign: "middle" }}>
                <Col
                    style={{ display: "grid", alignItems: "center" }}
                    align="left"
                    onClick={() => setSelectedDate(getDateInFewDays(selectedDate, 1))}
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
                    onClick={() => setSelectedDate(getDateInFewDays(selectedDate, -1))}
                >
                    <Icon icon="fa-caret-left fa-2xl" />
                </Col>
            </Row>
        </Container>
    );
}

export default DatePicker;
