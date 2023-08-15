import axios from "axios";

import {
    SETTINGS_LIST_REQUEST,
    SETTINGS_LIST_FAIL,
    SETTINGS_LIST_SUCCESS,
    SETTING_UPDATE_REQUEST,
    SETTING_UPDATE_FAIL,
    SETTING_UPDATE_SUCCESS,
} from "../constants/settingsConstants";

import Serializer from "../classes/serializer";
import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

const settingSerializer = new Serializer({
    key: "key",
    description: "description",
    value: "value",
});

export const listSettings = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SETTINGS_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/settings/list", config);

        const settings = data.map((settingData) =>
            settingSerializer.deserialize(settingData)
        );

        dispatch({ type: SETTINGS_LIST_SUCCESS, payload: settings });
    } catch (error) {
        dispatch({
            type: SETTINGS_LIST_FAIL,
            payload: serializeError(error),
        });
    }
};

export const updateSetting = (setting) => async (dispatch, getState) => {
    try {
        dispatch({ type: SETTING_UPDATE_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.post(
            `/api/settings/update/${setting.key}`,
            settingSerializer.serialize(setting, ["value"]),
            config
        );
        setting = settingSerializer.deserialize(data);

        dispatch({ type: SETTING_UPDATE_SUCCESS, payload: setting });

        dispatch(listSettings());
    } catch (error) {
        dispatch({
            type: SETTING_UPDATE_FAIL,
            payload: serializeError(error),
        });
    }
};
