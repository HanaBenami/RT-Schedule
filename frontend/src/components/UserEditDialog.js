import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CheckboxGroup from "react-checkbox-group";

import RestrictedComponent from "../components/RestrictedComponent";
import {
    UPDATE_USERS_PERMISSION,
    ADD_USERS_PERMISSION,
    USER_PERMISSIONS_MAP,
    USER_DEFAULT_PERMISSIONS,
    READ_USERS_PERMISSION,
} from "../constants/userAuthConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Icon from "../components/Icon";
import { createOrUpdateUser } from "../actions/userManagmentActions";
import UserLastLogin from "./UserLastLogin";

function UserEditDialog({
    user,
    readOnly,
    showUserEditDialog,
    onCloseUserEditDialog,
}) {
    const dispatch = useDispatch();

    const userCreateOrUpdate = useSelector((state) => state.userCreateOrUpdate);
    const {
        loading: userUpdateLoading,
        error: userUpdateError,
        success: userUpdateSuccess,
    } = userCreateOrUpdate;

    const [permissions, setPermissions] = useState();

    const [dataChanges, setDataChanges] = useState(false);

    const closeUserEditDialog = useCallback(() => {
        setDataChanges(false);
        onCloseUserEditDialog();
    }, [onCloseUserEditDialog]);

    useEffect(() => {
        if (userUpdateSuccess) {
            closeUserEditDialog();
        }
    }, [userUpdateSuccess, closeUserEditDialog]);

    useEffect(() => {
        setPermissions(user ? user.permissions : USER_DEFAULT_PERMISSIONS);
    }, [user]);

    return (
        <RestrictedComponent
            requiredPermission={
                readOnly
                    ? READ_USERS_PERMISSION
                    : user
                    ? UPDATE_USERS_PERMISSION
                    : ADD_USERS_PERMISSION
            }
        >
            <Modal
                show={showUserEditDialog}
                onHide={closeUserEditDialog}
                centered
            >
                <Modal.Header closeButton={false}>
                    <Modal.Title>
                        <Icon icon={readOnly ? "fa-eye" : "fa-pencil"} />
                        {user
                            ? user.firstName + " " + user.lastName
                            : "משתמש חדש"}

                        {userUpdateLoading ? (
                            <tr>
                                <td colSpan="2">
                                    <Loader size="40" />
                                </td>
                            </tr>
                        ) : userUpdateError ? (
                            <tr>
                                <td colSpan="2">
                                    <Message variant="danger">
                                        {userUpdateError}
                                    </Message>
                                </td>
                            </tr>
                        ) : (
                            <></>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form dir="rtl">
                        <Form.Group as={Row}>
                            <Form.Label column sm={3}>
                                שם פרטי
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    id={`firstNameInput${user && user.pk}`}
                                    defaultValue={user && user.firstName}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => {
                                        setDataChanges(true);
                                    }}
                                    disabled={readOnly}
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
                                    id={`lastNameInput${user && user.pk}`}
                                    defaultValue={user && user.lastName}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => setDataChanges(true)}
                                    disabled={readOnly}
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
                                    id={`emailInput${user && user.pk}`}
                                    defaultValue={user && user.email}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => setDataChanges(true)}
                                    disabled={readOnly}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm={3}>
                                הרשאות
                            </Form.Label>
                            <Col sm={9}>
                                <Container className="formControl">
                                    <CheckboxGroup
                                        key={`permission${user && user.pk}`}
                                        value={permissions}
                                        onChange={(values) => {
                                            setPermissions(values);
                                            setDataChanges(true);
                                        }}
                                    >
                                        {(Checkbox) => (
                                            <>
                                                {Object.keys(
                                                    USER_PERMISSIONS_MAP
                                                ).map((category) => (
                                                    <>
                                                        <Row>{category}</Row>
                                                        <Row className="border-bottom border-5 border-white">
                                                            {Object.keys(
                                                                USER_PERMISSIONS_MAP[
                                                                    category
                                                                ]
                                                            ).map(
                                                                (
                                                                    description
                                                                ) => {
                                                                    const permission =
                                                                        USER_PERMISSIONS_MAP[
                                                                            category
                                                                        ][
                                                                            description
                                                                        ];
                                                                    return (
                                                                        <Col
                                                                            sm={
                                                                                4
                                                                            }
                                                                        >
                                                                            <label
                                                                                key={`permission${
                                                                                    user &&
                                                                                    user.pk
                                                                                }_${permission}_label`}
                                                                            >
                                                                                <Checkbox
                                                                                    className="form-check-input"
                                                                                    key={`permission${
                                                                                        user &&
                                                                                        user.pk
                                                                                    }_${permission}_cb`}
                                                                                    value={
                                                                                        permission
                                                                                    }
                                                                                    disabled={
                                                                                        readOnly
                                                                                    }
                                                                                />
                                                                                {
                                                                                    description
                                                                                }
                                                                            </label>
                                                                        </Col>
                                                                    );
                                                                }
                                                            )}
                                                        </Row>
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </CheckboxGroup>
                                </Container>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col className="col-form-label">
                                <Form.Check
                                    reverse
                                    type="switch"
                                    label="משתמש פעיל"
                                    id={`isActiveInput${user && user.pk}`}
                                    onChange={() => setDataChanges(true)}
                                    defaultChecked={user ? user.isActive : true}
                                    disabled={readOnly}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col className="col-form-label">
                                <Form.Check
                                    reverse
                                    type="switch"
                                    label="משתמש זמני"
                                    id={`isTemporaryInput${user && user.pk}`}
                                    onChange={() => setDataChanges(true)}
                                    defaultChecked={
                                        user ? user.isTemporary : false
                                    }
                                    disabled={readOnly}
                                />
                            </Col>
                        </Form.Group>

                        {user && (
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>
                                    התחברות אחרונה
                                </Form.Label>
                                <Col sm={8} className="col-form-label">
                                    {user && <UserLastLogin user={user} />}
                                </Col>
                            </Form.Group>
                        )}

                        {user && (
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>
                                    תאריך הוספה
                                </Form.Label>
                                <Col sm={8} className="col-form-label">
                                    {user && user.createdAt}
                                </Col>
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="dark"
                        onClick={() => {
                            closeUserEditDialog();
                        }}
                    >
                        בטל
                    </Button>
                    <Button
                        variant="success"
                        disabled={!dataChanges}
                        onClick={() => {
                            dispatch(
                                createOrUpdateUser({
                                    ...user,
                                    firstName: document.getElementById(
                                        `firstNameInput${user && user.pk}`
                                    ).value,
                                    lastName: document.getElementById(
                                        `lastNameInput${user && user.pk}`
                                    ).value,
                                    email: document.getElementById(
                                        `emailInput${user && user.pk}`
                                    ).value,
                                    permissions: permissions,
                                    isActive: document.getElementById(
                                        `isActiveInput${user && user.pk}`
                                    ).checked,
                                    isTemporary: document.getElementById(
                                        `isTemporaryInput${user && user.pk}`
                                    ).checked,
                                })
                            );
                        }}
                    >
                        אשר
                    </Button>
                </Modal.Footer>
            </Modal>
        </RestrictedComponent>
    );
}

export default UserEditDialog;
