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

import Serializer from "../classes/serializer";
import serializeError from "../utils/serializeError";
import { getApiAuthConfig } from "./userAuthActions";

const callSerializer = new Serializer({
    id: "external_id",
    customer: "customer",
    type: "type",
    description: "description",
    vehicle: "vehicle",
    address: "address",
    contacts: "contacts",
    driverEmail: "driver_email",
    scheduledDate: "scheduled_date",
    scheduledOrder: "scheduled_order",
    driverNotes: "driver_notes",
    isDone: "is_done",
});

const contactSerializer = new Serializer({
    phone: "phone",
    name: "name",
});

const deserializedCallWithContacts = (serializedCall) => {
    let call = callSerializer.deserialize(serializedCall);
    call = {
        ...call,
        contacts: call.contacts.map((contact) => contactSerializer.deserialize(contact)),
    };
    return call;
};

export const listCalls = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CALL_LIST_REQUEST });

        const config = await getApiAuthConfig(dispatch, getState);

        const { data } = await axios.get("/api/calls/list", config);

        const calls = data.map((callData) => deserializedCallWithContacts(callData));
        calls.sort((a, b) => (a.id < b.id ? -1 : 1));

        dispatch({ type: CALL_LIST_SUCCESS, payload: calls });
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
            `/api/calls/update/${call.id}`,
            callSerializer.serialize(call, ["id", "driverNotes", "isDone"]),
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

        const calls = data.map((callData) => deserializedCallWithContacts(callData));

        dispatch({ type: CALL_ADD_SUCCESS, payload: calls });

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
