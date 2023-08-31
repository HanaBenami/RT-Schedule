import { useCallback, useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../hooks";
import Icon from "../utils/Icon";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import RestrictedComponent from "../utils/RestrictedComponent";
import useAuth from "../../auth/useAuth";
import {
    READ_SYSTEM_SETTINGS_PERMISSION,
    UPDATE_SYSTEM_SETTINGS_PERMISSION,
} from "../../classes/permissions";
import { Setting } from "../../classes/setting";
import { updateSetting } from "../../slices/settings/settingUpdateSlice";

interface SettingFormProps {
    setting: Setting;
}

function SettingForm({ setting }: SettingFormProps) {
    const { currentUserPermissions } = useAuth();
    const readOnly = !(
        currentUserPermissions && currentUserPermissions.includes(UPDATE_SYSTEM_SETTINGS_PERMISSION)
    );

    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState<number>(setting.value);
    const [valueChanged, setValueChanged] = useState(false);
    const [updateRequested, setUpdateRequested] = useState(false);

    const dispatch = useAppDispatch();
    const settingUpdate = useAppSelector((state) => state.settingUpdate);
    const { status, error } = settingUpdate;

    const closeEditMode = useCallback(() => {
        setValueChanged(false);
        setUpdateRequested(false);
        setEditMode(false);
    }, []);

    // closing edit mode w/o saving -> resetting the original setting value
    useEffect(() => {
        if (!editMode) {
            setValue(setting.value);
        }
    }, [setting, editMode]);

    // succesful value update -> closing edit mode
    useEffect(() => {
        if (status === "success" && updateRequested) {
            closeEditMode();
        }
    }, [status, updateRequested, closeEditMode]);

    return (
        <RestrictedComponent requiredPermission={READ_SYSTEM_SETTINGS_PERMISSION}>
            <Form dir="rtl">
                <Form.Group as={Row} className="d-flex align-items-center justify-content-right">
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
                                setValueChanged(true);
                                setValue(Number(e.target.value));
                            }}
                            disabled={!editMode}
                        />
                    </Col>
                    <Col sm={5}>
                        {readOnly ? (
                            <></>
                        ) : editMode ? (
                            status === "loading" && updateRequested ? (
                                <Loader size={20} />
                            ) : (
                                <>
                                    <Button
                                        className="m-2"
                                        variant="dark"
                                        onClick={closeEditMode}
                                        disabled={status === "loading"}
                                    >
                                        <Icon icon="fa-undo" />
                                        בטל
                                    </Button>
                                    <Button
                                        className="m-2"
                                        variant="success"
                                        onClick={() => {
                                            setUpdateRequested(true);
                                            dispatch(
                                                updateSetting({
                                                    ...setting,
                                                    value: value,
                                                })
                                            );
                                        }}
                                        disabled={status === "loading" || !valueChanged}
                                    >
                                        <Icon icon="fa-save" />
                                        שמור
                                    </Button>
                                    {error && <Message variant="danger">{error}</Message>}
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
