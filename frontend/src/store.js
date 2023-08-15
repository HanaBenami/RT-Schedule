import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    addCallsExampleReducer,
    addCallsReducer,
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
    userCreateOrUpdateReducer,
    basicUserCreateReducer,
} from "./reducers/userManagmentReducer";

const reducer = combineReducers({
    callsList: callsListReducer,
    callUpdate: callUpdateReducer,
    addCalls: addCallsReducer,
    addCallsExample: addCallsExampleReducer,
    settingsList: settingsListReducer,
    settingUpdate: settingUpdateReducer,
    userAuth: userAuthReducer,
    usersList: userListReducer,
    userCreateOrUpdate: userCreateOrUpdateReducer,
    basicUserCreate: basicUserCreateReducer,
});

const middleware = [thunk];

const initialState = {};

const store = legacy_createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
