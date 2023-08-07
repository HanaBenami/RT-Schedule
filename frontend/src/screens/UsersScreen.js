import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";

import { listUsers } from "../actions/userManagmentActions";
import UsersTable from "../components/UsersTable";
import UserEditDialog from "../components/UserEditDialog";
import Title from "../components/Title";
import Loader from "../components/Loader";
import Message from "../components/Message";

function UsersScreen() {
    const dispatch = useDispatch();

    const usersList = useSelector((state) => state.usersList);
    const {
        loading: usersListLoading,
        error: usersListError,
        users,
    } = usersList;

    const [showUserEditDialog, setShowUserEditDialog] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    const onUserEdit = useCallback(
        (user, readOnly) => {
            setReadOnly(readOnly);
            setSelectedUser(user);
            setShowUserEditDialog(true);
        },
        [setSelectedUser, setShowUserEditDialog]
    );

    const onUserAddition = useCallback(() => {
        setReadOnly(false);
        setShowUserEditDialog(true);
    }, [setShowUserEditDialog]);

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
                                    onUserEdit={onUserEdit}
                                    onUserAddition={onUserAddition}
                                />

                                <UserEditDialog
                                    user={selectedUser}
                                    readOnly={readOnly}
                                    showUserEditDialog={showUserEditDialog}
                                    onCloseUserEditDialog={
                                        onCloseUserEditDialog
                                    }
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
