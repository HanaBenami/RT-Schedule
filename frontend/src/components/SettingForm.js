import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { updateSetting } from "../actions/settingsAction";
import Loader from "./Loader";
import Message from "./Message";
import Title from "./Title";
import RestrictedComponent from "./RestrictedComponent";
import {
    READ_SYSTEM_SETTINGS_PERMISSION,
    UPDATE_SYSTEM_SETTINGS_PERMISSION,
} from "../constants/userAuthConstants";
import Icon from "./Icon";
import useAuth from "../auth/useAuth";

function SettingForm({ setting }) {
    const { permissions } = useAuth();
    const readOnly = !(
        permissions && permissions.includes(UPDATE_SYSTEM_SETTINGS_PERMISSION)
    );

    const [editMode, setEditMode] = useState(false);
    const [dataChanges, setDataChanges] = useState(false);
    const [value, setValue] = useState(setting.current_value);

    const dispatch = useDispatch();
    const settingUpdate = useSelector((state) => state.settingUpdate);
    const { loading, error, success } = settingUpdate;

    const closeEditMode = useCallback(() => {
        setDataChanges(false);
        setEditMode(false);
        setValue(setting.current_value);
    }, [setting]);

    useEffect(() => {
        if (success) {
            closeEditMode();
        }
    }, [success, closeEditMode]);

    return (
        <RestrictedComponent
            requiredPermission={READ_SYSTEM_SETTINGS_PERMISSION}
        >
            <Form dir="rtl">
                <Form.Group
                    as={Row}
                    className="d-flex align-items-center justify-content-right"
                >
                    <Form.Label column htmlFor={setting.key} sm={5}>
                        {setting.description}
                    </Form.Label>
                    <Col sm={2}>
                        <Form.Control
                            className="m-0 px-2 "
                            type="number"
                            id={setting.key}
                            value={value}
                            onChange={(e) => {
                                setDataChanges(true);
                                setValue(e.target.value);
                            }}
                            disabled={!editMode}
                        />
                    </Col>
                    <Col sm={5}>
                        {readOnly ? (
                            <></>
                        ) : editMode ? (
                            loading ? (
                                <Loader size={20} />
                            ) : (
                                <>
                                    <Button
                                        className="m-2"
                                        variant="dark"
                                        onClick={closeEditMode}
                                        disabled={loading}
                                    >
                                        <Icon icon="fa-undo" />
                                        בטל
                                    </Button>
                                    <Button
                                        className="m-2"
                                        variant="success"
                                        onClick={() => {
                                            dispatch(
                                                updateSetting({
                                                    ...setting,
                                                    new_value: value,
                                                })
                                            );
                                        }}
                                        disabled={loading || !dataChanges}
                                    >
                                        <Icon icon="fa-save" />
                                        שמור
                                    </Button>
                                    {error && (
                                        <Message variant="danger">
                                            {error}
                                        </Message>
                                    )}
                                </>
                            )
                        ) : (
                            <Button
                                className="m-2"
                                variant="dark"
                                onClick={() => {
                                    setEditMode(true);
                                }}
                            >
                                <Icon icon="fa-pencil" />
                                עריכה
                            </Button>
                        )}
                    </Col>
                </Form.Group>
            </Form>
        </RestrictedComponent>
    );
}

export default SettingForm;
