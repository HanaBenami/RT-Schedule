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
    CALL_ADD_SUCCESS,
    CALL_ADD_FAIL,
} from "../constants/callConstants";

export const callsListReducer = (state = {}, action) => {
    switch (action.type) {
        case CALL_LIST_REQUEST:
            return { ...state, loading: true };
        case CALL_LIST_SUCCESS:
            return {
                loading: false,
                success: true,
                calls: action.payload,
            };
        case CALL_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const callUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case CALL_UPDATE_REQUEST:
            return { ...state, loading: true };
        case CALL_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true,
                call: action.payload,
            };
        case CALL_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const addCallsReducer = (state = {}, action) => {
    switch (action.type) {
        case CALL_ADD_REQUEST:
            return { ...state, loading: true };
        case CALL_ADD_SUCCESS:
            return {
                loading: false,
                success: true,
                calls: action.payload,
            };
        case CALL_ADD_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const addCallsExampleReducer = (
    state = { jsonExample: null },
    action
) => {
    switch (action.type) {
        case CALL_ADD_EXAMPLE_REQUEST:
            return { ...state, loading: true };
        case CALL_ADD_EXAMPLE_SUCCESS:
            return {
                loading: false,
                success: true,
                jsonExample: action.payload,
            };
        case CALL_ADD_EXAMPLE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
