import axios from "axios";

import {
    SETTINGS_LIST_REQUEST,
    SETTINGS_LIST_FAIL,
    SETTINGS_LIST_SUCCESS,
    SETTING_UPDATE_REQUEST,
    SETTING_UPDATE_FAIL,
    SETTING_UPDATE_SUCCESS,
} from "../constants/settingsConstants";

import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

export const listSettings = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SETTINGS_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/settings/list", config);

        dispatch({ type: SETTINGS_LIST_SUCCESS, payload: data });
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
            {
                new_value: setting.new_value,
            },
            config
        );

        dispatch({ type: SETTING_UPDATE_SUCCESS, payload: data });

        dispatch(listSettings());
    } catch (error) {
        dispatch({
            type: SETTING_UPDATE_FAIL,
            payload: serializeError(error),
        });
    }
};
