import { useEffect } from "react";
import { useState } from "react";
import { Container, Row } from "react-bootstrap";

import DatePicker from "../components/utils/DatePicker";
import UserPicker from "../components/users/UserPicker";
import CallsGrid from "../components/calls/CallsGrid";
import Title from "../components/utils/Title";
import useAuth from "../auth/useAuth";
import RestrictedComponent from "../components/utils/RestrictedComponent";
import {
    READ_MY_CALLS_PERMISSION,
    READ_OTHER_CALLS_PERMISSION,
    UPDATE_MY_CALLS_PERMISSION,
    UPDATE_OTHER_CALLS_PERMISSION,
} from "../classes/permissions";

function ScheduleScreen() {
    const { currentUser, currentUserPermissions } = useAuth();
    const hasPermissionToUpdateCallsAssignedToSelf =
        currentUserPermissions && currentUserPermissions.includes(UPDATE_MY_CALLS_PERMISSION);
    const hasPermissionToUpdateCallsAssignToOthers =
        currentUserPermissions && currentUserPermissions.includes(UPDATE_OTHER_CALLS_PERMISSION);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDriverEmail, setSelectedDriverEmail] = useState<string | undefined | null>(null);

    // setting the current user as the initial selected user
    useEffect(() => {
        if (currentUser && selectedDriverEmail === null) {
            setSelectedDriverEmail(currentUser.email);
        }
    }, [currentUser, selectedDriverEmail]);

    return (
        <RestrictedComponent requiredPermission={READ_MY_CALLS_PERMISSION}>
            <Container>
                <Row align="center">
                    <Title>סידור עבודה</Title>
                </Row>
                <Row>
                    <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </Row>
                <RestrictedComponent requiredPermission={READ_OTHER_CALLS_PERMISSION}>
                    <Row align="center">
                        <UserPicker
                            selectedUserEmail={selectedDriverEmail}
                            setSelectedUserEmail={setSelectedDriverEmail}
                        />
                    </Row>
                </RestrictedComponent>
                <Row>
                    <CallsGrid
                        userEmail={selectedDriverEmail}
                        scheduledDate={selectedDate}
                        readOnly={
                            currentUser === undefined ||
                            (selectedDriverEmail === currentUser.email &&
                                !hasPermissionToUpdateCallsAssignedToSelf) ||
                            (selectedDriverEmail !== currentUser.email &&
                                !hasPermissionToUpdateCallsAssignToOthers)
                        }
                    />
                </Row>
            </Container>
        </RestrictedComponent>
    );
}

export default ScheduleScreen;
