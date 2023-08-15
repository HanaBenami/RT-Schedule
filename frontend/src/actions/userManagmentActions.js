import axios from "axios";

import {
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_CREATE_OR_UPDATE_REQUEST,
    USER_CREATE_OR_UPDATE_SUCCESS,
    USER_CREATE_OR_UPDATE_FAIL,
    BASIC_USER_CREATE_REQUEST,
    BASIC_USER_CREATE_SUCCESS,
    BASIC_USER_CREATE_FAIL,
} from "../constants/userManagmentConstants";

import Serializer from "../classes/serializer";
import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

const userSerializer = new Serializer({
    pk: "pk",
    firstName: "first_name",
    lastName: "last_name",
    nickname: "nickname",
    email: "email",
    isActive: "is_active",
    isTemporary: "is_temporary",
    permissions: "permissions",
    createdAt: "created_at",
    lastLogin: "last_login",
    lastLoginUpdate: "last_login_update",
});

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/users/list", config);

        const users = data.map((userData) =>
            userSerializer.deserialize(userData)
        );
        users.sort((a, b) => a.lastName.localeCompare(b.lastName));
        users.sort((a, b) => a.firstName.localeCompare(b.firstName));

        dispatch({ type: USER_LIST_SUCCESS, payload: users });
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: serializeError(error),
        });
    }
};

export const createOrUpdateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_CREATE_OR_UPDATE_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.post(
            user.pk ? `/api/users/update/${user.pk}` : `/api/users/create/`,
            userSerializer.serialize(user, [
                "firstName",
                "lastName",
                "email",
                "isActive",
                "isTemporary",
                "permissions",
            ]),
            config
        );

        dispatch({ type: USER_CREATE_OR_UPDATE_SUCCESS, payload: data });

        dispatch(listUsers());
    } catch (error) {
        dispatch({
            type: USER_CREATE_OR_UPDATE_FAIL,
            payload: serializeError(error),
        });
    }
};

export const createBasicUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: BASIC_USER_CREATE_REQUEST });

        const { data } = await axios.post(
            `/api/users/create/basic/`,
            userSerializer.serialize(user, ["firstName", "lastName", "email"]),
            { headers: { "Content-type": "application/json" } }
        );

        dispatch({ type: BASIC_USER_CREATE_SUCCESS, payload: data });

        dispatch(listUsers());
    } catch (error) {
        dispatch({
            type: BASIC_USER_CREATE_FAIL,
            payload: serializeError(error),
        });
    }
};
