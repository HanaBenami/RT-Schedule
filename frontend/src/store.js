import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    addCallExampleReducer,
    addCallReducer,
    callsListReducer,
    callUpdateReducer,
} from "./reducers/callReducer";
import {
    settingsListReducer,
    settingUpdateReducer,
} from "./reducers/settingsReducer";
import { userAuthReducer } from "./reducers/userAuthReducer";
import {
    userListReducer,
    userUpdateReducer,
} from "./reducers/userManagmentReducer";

const reducer = combineReducers({
    callsList: callsListReducer,
    callUpdate: callUpdateReducer,
    addCall: addCallReducer,
    addCallExample: addCallExampleReducer,
    settingsList: settingsListReducer,
    settingUpdate: settingUpdateReducer,
    userAuth: userAuthReducer,
    usersList: userListReducer,
    userUpdate: userUpdateReducer,
});

const middleware = [thunk];

const initialState = {};

const store = legacy_createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
