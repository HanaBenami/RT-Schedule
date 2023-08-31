import { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CheckboxGroup from "react-checkbox-group";

import {
    UPDATE_USERS_PERMISSION,
    ADD_USERS_PERMISSION,
    USER_PERMISSIONS_MAP,
    USER_DEFAULT_PERMISSIONS,
    READ_USERS_PERMISSION,
    USER_PERMISSIONS_KEYS_TO_TITLE,
    Permission,
} from "../../classes/permissions";

import { useAppDispatch, useAppSelector } from "../../hooks";
import RestrictedComponent from "../utils/RestrictedComponent";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import Icon from "../utils/Icon";
import UserLastLogin from "./UserLastLogin";
import { User } from "../../classes/user";
import { createOrUpdateUser } from "../../slices/users/userCreateOrUpdateSlice";

interface UserEditDialogProps {
    user: User | null;
    readOnly: boolean;
    showUserEditDialog: boolean;
    onCloseUserEditDialog: () => void;
}

function UserEditDialog({
    user,
    readOnly,
    showUserEditDialog,
    onCloseUserEditDialog,
}: UserEditDialogProps) {
    const dispatch = useAppDispatch();

    const userCreateOrUpdate = useAppSelector((state) => state.userCreateOrUpdate);
    const { status: userUpdateStatus, error: userUpdateError } = userCreateOrUpdate;

    const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

    const [dataChanged, setDataChanged] = useState(false);

    const closeUserEditDialog = useCallback(() => {
        setDataChanged(false);
        onCloseUserEditDialog();
    }, [onCloseUserEditDialog]);

    // succesful user update -> closing edit dialog
    useEffect(() => {
        if (userUpdateStatus === "success") {
            closeUserEditDialog();
        }
    }, [userUpdateStatus, closeUserEditDialog]);

    // loading user permission
    useEffect(() => {
        setUserPermissions(user && user.permissions ? user.permissions : USER_DEFAULT_PERMISSIONS);
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
            <Modal show={showUserEditDialog} onHide={closeUserEditDialog} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>
                        <Icon icon={readOnly ? "fa-eye" : "fa-pencil"} />
                        {user ? user.firstName + " " + user.lastName : "משתמש חדש"}

                        {userUpdateStatus === "loading" ? (
                            <tr>
                                <td colSpan={2}>
                                    <Loader size={40} />
                                </td>
                            </tr>
                        ) : userUpdateStatus === "error" && userUpdateError ? (
                            <tr>
                                <td colSpan={2}>
                                    <Message variant="danger">{userUpdateError}</Message>
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
                                    defaultValue={user && user.firstName ? user.firstName : ""}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => {
                                        setDataChanged(true);
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
                                    defaultValue={user && user.lastName ? user.lastName : ""}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => setDataChanged(true)}
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
                                    defaultValue={user && user.email ? (user.email as string) : ""}
                                    style={{
                                        width: "100%",
                                    }}
                                    onChange={() => setDataChanged(true)}
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
                                        name={`permission${user && user.pk}`}
                                        key={`permission${user && user.pk}`}
                                        value={userPermissions}
                                        onChange={(values) => {
                                            setUserPermissions(values);
                                            setDataChanged(true);
                                        }}
                                    >
                                        {(Checkbox) => (
                                            <>
                                                {USER_PERMISSIONS_MAP.map((permissionGroup) => (
                                                    <>
                                                        <Row>{permissionGroup.title}</Row>
                                                        <Row className="border-bottom border-5 border-white">
                                                            {Object.entries(
                                                                permissionGroup.permissions
                                                            ).map(([key, value]) => {
                                                                const description =
                                                                    USER_PERMISSIONS_KEYS_TO_TITLE.get(
                                                                        key
                                                                    );
                                                                const permission = value;
                                                                return (
                                                                    <Col
                                                                        sm={4}
                                                                        key={`permission${
                                                                            user && user.pk
                                                                        }_${permission}_col`}
                                                                    >
                                                                        <label
                                                                            key={`permission${
                                                                                user && user.pk
                                                                            }_${permission}_label`}
                                                                        >
                                                                            <Checkbox
                                                                                key={`permission${
                                                                                    user && user.pk
                                                                                }_${permission}_cb`}
                                                                                value={permission}
                                                                                disabled={readOnly}
                                                                            />
                                                                            {description}
                                                                        </label>
                                                                    </Col>
                                                                );
                                                            })}
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
                                    onChange={() => setDataChanged(true)}
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
                                    onChange={() => setDataChanged(true)}
                                    defaultChecked={user ? user.isTemporary : false}
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
                        disabled={!dataChanged}
                        onClick={() => {
                            dispatch(
                                createOrUpdateUser({
                                    ...user,
                                    firstName: (
                                        document.getElementById(
                                            `firstNameInput${user && user.pk}`
                                        ) as HTMLInputElement
                                    ).value,
                                    lastName: (
                                        document.getElementById(
                                            `lastNameInput${user && user.pk}`
                                        ) as HTMLInputElement
                                    ).value,
                                    email: (
                                        document.getElementById(
                                            `emailInput${user && user.pk}`
                                        ) as HTMLInputElement
                                    ).value,
                                    permissions: userPermissions,
                                    isActive: (
                                        document.getElementById(
                                            `isActiveInput${user && user.pk}`
                                        ) as HTMLInputElement
                                    ).checked,
                                    isTemporary: (
                                        document.getElementById(
                                            `isTemporaryInput${user && user.pk}`
                                        ) as HTMLInputElement
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
