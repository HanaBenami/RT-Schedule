import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_AUTH,
    USER_INFO,
    USER_ACCESS_TOKEN,
    USER_EMAIL,
} from "../constants/userAuthConstants";

import serializeError from "../utils/serializeError";
import getApiAuthHeaders from "../auth/getApiAuthHeaders";

export const saveUserInfo = (user, accessToken) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        if (null == user || null == accessToken) {
            throw new Error("User info is missing");
        }
        const data = {
            [USER_EMAIL]: user.email,
            [USER_ACCESS_TOKEN]: accessToken,
        };

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: serializeError(error),
        });
    }
};

export const resetUserInfo = () => (dispatch) => {
    dispatch({ type: USER_LOGOUT });
};

export const getApiAuthConfig = async (dispatch, getState) => {
    try {
        const accessToken = getState()[USER_AUTH][USER_INFO][USER_ACCESS_TOKEN];
        if (accessToken === null) {
            throw Error("The access token isn't ready");
        }

        const config = {
            headers: getApiAuthHeaders(getState()[USER_AUTH][USER_INFO][USER_ACCESS_TOKEN]),
        };
        return config;
    } catch (error) {
        function delay(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        await delay(1000); // wait for login to be completed and user info to be saved/restored
        return getApiAuthConfig(dispatch, getState);
    }
};
