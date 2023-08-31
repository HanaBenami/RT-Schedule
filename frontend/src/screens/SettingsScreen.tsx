import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Container, Row } from "react-bootstrap";

import { fetchSettingsList } from "../slices/settings/settingsListSlice";
import SettingForm from "../components/settings/SettingForm";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import Title from "../components/utils/Title";
import RestrictedComponent from "../components/utils/RestrictedComponent";
import { READ_SYSTEM_SETTINGS_PERMISSION } from "../classes/permissions";
import { Setting } from "../classes/setting";

function SettingsScreen() {
    const dispatch = useAppDispatch();
    const settingsList = useAppSelector((state) => state.settingsList);
    const { status, error, items: settings } = settingsList;

    // loading list of settings
    useEffect(() => {
        dispatch(fetchSettingsList());
    }, [dispatch]);

    return (
        <RestrictedComponent requiredPermission={READ_SYSTEM_SETTINGS_PERMISSION}>
            <Container>
                <Row align="center">
                    <Title>הגדרות מערכת</Title>
                </Row>
                <Row>
                    {settings &&
                        settings.map((setting: Setting) => (
                            <SettingForm setting={setting} key={`form-${setting.key}`} />
                        ))}
                    {status === "loading" ? (
                        <Loader />
                    ) : status === "error" && error ? (
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
