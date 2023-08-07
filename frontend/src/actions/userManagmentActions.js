import axios from "axios";

import {
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
} from "../constants/userManagmentConstants";

import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/users/list", config);
        data.sort((a, b) => a.last_name.localeCompare(b.last_name));
        data.sort((a, b) => a.first_name.localeCompare(b.first_name));

        dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: serializeError(error),
        });
    }
};

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        console.log(user);
        const { data } = await axios.post(
            user.pk ? `/api/users/update/${user.pk}` : `/api/users/create/`,
            {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                is_active: user.is_active,
                permissions: user.permissions,
            },
            config
        );

        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });

        dispatch(listUsers());
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: serializeError(error),
        });
    }
};
