import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Row } from "react-bootstrap";

import ScheduledCallsGrid from "../components/ScheduledCallsGrid";
import DatePicker from "../components/DatePicker";
import Title from "../components/Title";
import RestrictedComponent from "../components/RestrictedComponent";
import {
    READ_MY_CALLS_PERMISSION,
    READ_OTHER_CALLS_PERMISSION,
} from "../constants/userAuthConstants";
import useAuth from "../auth/useAuth";
import UserPicker from "../components/UserPicker";

function ScheduleScreen() {
    const { user } = useAuth();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDriverEmail, setSelectedDriverEmail] = useState(null);

    useEffect(() => {
        if (user && selectedDriverEmail === null) {
            setSelectedDriverEmail(user.email);
        }
    }, [user, selectedDriverEmail]);

    return (
        <RestrictedComponent requiredPermission={READ_MY_CALLS_PERMISSION}>
            <Container>
                <Row align="center">
                    <Title>סידור עבודה</Title>
                </Row>
                <Row>
                    <DatePicker
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                </Row>
                <RestrictedComponent
                    requiredPermission={READ_OTHER_CALLS_PERMISSION}
                >
                    <Row align="center">
                        <UserPicker
                            selectedUserEmail={selectedDriverEmail}
                            setSelectedUserEmail={setSelectedDriverEmail}
                        />
                    </Row>
                </RestrictedComponent>
                <Row>
                    <ScheduledCallsGrid
                        userEmail={selectedDriverEmail}
                        date={selectedDate}
                    />
                </Row>
            </Container>
        </RestrictedComponent>
    );
}

export default ScheduleScreen;
