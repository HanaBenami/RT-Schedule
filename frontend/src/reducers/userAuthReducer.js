import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_INFO,
    USER_ACCESS_TOKEN,
    USER_EMAIL,
} from "../constants/userAuthConstants";

const initialState = {
    loading: true,
    error: null,
    [USER_INFO]: { [USER_EMAIL]: null, [USER_ACCESS_TOKEN]: null },
};

export const userAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST: {
            return { ...state, loading: true };
        }

        case USER_LOGIN_SUCCESS: {
            return { ...state, loading: false, [USER_INFO]: action.payload };
        }

        case USER_LOGIN_FAIL: {
            return { ...state, loading: false, error: action.payload };
        }

        case USER_LOGOUT: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};
