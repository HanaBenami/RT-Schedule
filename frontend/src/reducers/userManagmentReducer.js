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

export const userListReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { ...state, loading: true };
        case USER_LIST_SUCCESS:
            return {
                loading: false,
                success: true,
                users: action.payload,
            };
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userCreateOrUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_CREATE_OR_UPDATE_REQUEST:
            return { ...state, loading: true };
        case USER_CREATE_OR_UPDATE_SUCCESS:
            return { loading: false, success: true, user: action.payload };
        case USER_CREATE_OR_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const basicUserCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case BASIC_USER_CREATE_REQUEST:
            return { ...state, loading: true };
        case BASIC_USER_CREATE_SUCCESS:
            return { loading: false, success: true, user: action.payload };
        case BASIC_USER_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
