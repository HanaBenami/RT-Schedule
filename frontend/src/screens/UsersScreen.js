import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";

import { listUsers } from "../actions/userManagmentActions";
import UsersTable from "../components/users/UsersTable";
import UserEditDialog from "../components/users/UserEditDialog";
import Title from "../components/utils/Title";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";

function UsersScreen() {
    const dispatch = useDispatch();

    const usersList = useSelector((state) => state.usersList);
    const { loading: usersListLoading, error: usersListError, users } = usersList;

    const [showUserEditDialog, setShowUserEditDialog] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // loading list of users
    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    // selecting user -> open user edit dialog for that user
    const onUserSelection = useCallback(
        (user, readOnly) => {
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
    }, [setSelectedUser, setShowUserEditDialog]);

    return (
        <Container>
            <Row align="center">
                <Title>משתמשים</Title>
            </Row>
            <Row>
                <Col align="center">
                    <>
                        {usersListLoading ? (
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
