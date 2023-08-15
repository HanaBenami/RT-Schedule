import {
    SETTINGS_LIST_REQUEST,
    SETTINGS_LIST_FAIL,
    SETTINGS_LIST_SUCCESS,
    SETTING_UPDATE_REQUEST,
    SETTING_UPDATE_FAIL,
    SETTING_UPDATE_SUCCESS,
} from "../constants/settingsConstants";

export const settingsListReducer = (state = {}, action) => {
    switch (action.type) {
        case SETTINGS_LIST_REQUEST:
            return { ...state, loading: true };
        case SETTINGS_LIST_SUCCESS:
            return {
                loading: false,
                success: true,
                settings: action.payload,
            };
        case SETTINGS_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const settingUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case SETTING_UPDATE_REQUEST:
            return { ...state, loading: true };
        case SETTING_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true,
                setting: action.payload,
            };
        case SETTING_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
