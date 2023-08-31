import { legacy_createStore, combineReducers, applyMiddleware, AnyAction } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkDispatch } from "redux-thunk";

import userAuthReducer from "./slices/users/userAuthSlice";
import usersListReducer from "./slices/users/usersListSlice";
import userCreateOrUpdateReducer from "./slices/users/userCreateOrUpdateSlice";
import userBasicCreateReducer from "./slices/users/userBasicCreateSlice";
import settingsListReducer from "./slices/settings/settingsListSlice";
import settingUpdateReducer from "./slices/settings/settingUpdateSlice";
import callsListReducer from "./slices/calls/callsListSlice";
import callUpdateReducer from "./slices/calls/callUpdateSlice";
import addCallsReducer from "./slices/calls/addCallsSlice";
import addCallsExampleReducer from "./slices/calls/addCallsExampleSlice";

const combinedState = combineReducers({
    callsList: callsListReducer,
    callUpdate: callUpdateReducer,
    addCalls: addCallsReducer,
    addCallsExample: addCallsExampleReducer,
    settingsList: settingsListReducer,
    settingUpdate: settingUpdateReducer,
    userAuth: userAuthReducer,
    usersList: usersListReducer,
    userCreateOrUpdate: userCreateOrUpdateReducer,
    userBasicCreate: userBasicCreateReducer,
});

const middleware = [thunk];

const initialState = {};

const appStore = legacy_createStore(
    combinedState,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default appStore;
export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch &
    ThunkDispatch<typeof initialState, null, AnyAction>;
