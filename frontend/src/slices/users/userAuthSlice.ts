import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { type SerializedError } from "../../utils/serializeError";
import { BasicUser } from "../../classes/user";

const emptyUser: BasicUser = {
    email: null,
    accessToken: null,
};

export type UserAuthState = {
    loading: boolean;
    error: SerializedError;
    currentUser: BasicUser;
};

const initialState: UserAuthState = {
    loading: false,
    error: null,
    currentUser: emptyUser,
};

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLoginRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.currentUser = emptyUser;
        },
        userLoginSuccess: (state, action: PayloadAction<BasicUser>) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        userLoginFailure: (state, action: PayloadAction<SerializedError>) => {
            state.loading = false;
            state.error = action.payload;
            state.currentUser = emptyUser;
        },
        userLogout: (state) => {
            state.loading = initialState.loading;
            state.error = initialState.error;
            state.currentUser = initialState.currentUser;
        },
    },
});

export const { userLoginRequest, userLoginSuccess, userLoginFailure, userLogout } =
    userAuthSlice.actions;

export default userAuthSlice.reducer;
