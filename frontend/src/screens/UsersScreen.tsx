import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../hooks";
import UsersTable from "../components/users/UsersTable";
import UserEditDialog from "../components/users/UserEditDialog";
import Title from "../components/utils/Title";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import { User } from "../classes/user";
import { fetchUsersList } from "../slices/users/usersListSlice";
import { reset } from "../slices/users/userCreateOrUpdateSlice";

function UsersScreen() {
    const dispatch = useAppDispatch();

    const usersList = useAppSelector((state) => state.usersList);
    const { status: usersListStatus, error: usersListError, items: users } = usersList;

    const [showUserEditDialog, setShowUserEditDialog] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // loading list of users
    useEffect(() => {
        dispatch(fetchUsersList());
    }, [dispatch]);

    // selecting user -> open user edit dialog for that user
    const onUserSelection = useCallback(
        (user: User, readOnly: boolean) => {
            setReadOnly(readOnly);
            setSelectedUser(user);
            setShowUserEditDialog(true);
        },
        [setSelectedUser, setShowUserEditDialog]
    );

    // clicking on user addinng -> open empty user edit dialog
    const onUserAddition = useCallback(() => {
        setReadOnly(false);
        setShowUserEditDialog(true);
    }, [setShowUserEditDialog]);

    // closing user edit dialog -> resetting user selection
    const onCloseUserEditDialog = useCallback(() => {
        setSelectedUser(null);
        setShowUserEditDialog(false);
        dispatch(reset(undefined));
    }, [setSelectedUser, setShowUserEditDialog]);

    return (
        <Container>
            <Row align="center">
                <Title>משתמשים</Title>
            </Row>
            <Row>
                <Col align="center">
                    <>
                        {usersListStatus === "loading" ? (
                            <Loader />
                        ) : usersListError ? (
                            <Message variant="danger">{usersListError}</Message>
                        ) : (
                            <>
                                <UsersTable
                                    users={users}
                                    onUserSelection={onUserSelection}
                                    onUserAddition={onUserAddition}
                                />

                                <UserEditDialog
                                    user={selectedUser}
                                    readOnly={readOnly}
                                    showUserEditDialog={showUserEditDialog}
                                    onCloseUserEditDialog={onCloseUserEditDialog}
                                />
                            </>
                        )}
                    </>
                </Col>
            </Row>
        </Container>
    );
}

export default UsersScreen;
