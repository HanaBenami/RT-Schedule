import axios from "axios";

import {
    CALL_LIST_REQUEST,
    CALL_LIST_SUCCESS,
    CALL_LIST_FAIL,
    CALL_UPDATE_REQUEST,
    CALL_UPDATE_SUCCESS,
    CALL_UPDATE_FAIL,
    CALL_ADD_EXAMPLE_REQUEST,
    CALL_ADD_EXAMPLE_SUCCESS,
    CALL_ADD_EXAMPLE_FAIL,
    CALL_ADD_REQUEST,
    CALL_ADD_FAIL,
    CALL_ADD_SUCCESS,
} from "../constants/callConstants";

import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

export const listCalls = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CALL_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/calls/list", config);

        dispatch({ type: CALL_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CALL_LIST_FAIL,
            payload: serializeError(error),
        });
    }
};

export const updateCall = (call) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALL_UPDATE_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.post(
            `/api/calls/update/${call.externalId}`,
            {
                externalId: call.externalId,
                driverNotes: call.driverNotes,
                isDone: call.isDone,
            },
            config
        );

        dispatch({ type: CALL_UPDATE_SUCCESS, payload: data });

        dispatch(listCalls());
    } catch (error) {
        dispatch({
            type: CALL_UPDATE_FAIL,
            payload: serializeError(error),
        });
    }
};

export const addCalls = (jsonInput) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALL_ADD_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.post(`/api/calls/add`, jsonInput, config);

        dispatch({ type: CALL_ADD_SUCCESS, payload: data });

        dispatch(listCalls());
    } catch (error) {
        dispatch({
            type: CALL_ADD_FAIL,
            payload: serializeError(error),
        });
    }
};

export const getAddCallExample = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CALL_ADD_EXAMPLE_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get(`/api/calls/add/example`, config);

        dispatch({ type: CALL_ADD_EXAMPLE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CALL_ADD_EXAMPLE_FAIL,
            payload: serializeError(error),
        });
    }
};
