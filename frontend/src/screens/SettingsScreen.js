import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";

import { listSettings } from "../actions/settingsAction";
import SettingForm from "../components/settings/SettingForm";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import Title from "../components/utils/Title";
import RestrictedComponent from "../components/utils/RestrictedComponent";
import { READ_SYSTEM_SETTINGS_PERMISSION } from "../constants/userAuthConstants";

function SettingsScreen() {
    const dispatch = useDispatch();
    const settingsList = useSelector((state) => state.settingsList);
    const { loading, error, settings } = settingsList;

    // loading list of settings
    useEffect(() => {
        dispatch(listSettings());
    }, [dispatch]);

    return (
        <RestrictedComponent requiredPermission={READ_SYSTEM_SETTINGS_PERMISSION}>
            <Container>
                <Row align="center">
                    <Title>הגדרות מערכת</Title>
                </Row>
                <Row>
                    {settings &&
                        settings.map((setting) => (
                            <SettingForm setting={setting} key={`form-${setting.key}`} />
                        ))}
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">{error}</Message>
                    ) : (
                        <></>
                    )}
                </Row>
            </Container>
        </RestrictedComponent>
    );
}

export default SettingsScreen;
