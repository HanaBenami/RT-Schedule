export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

export const USER_LOGOUT = "USER_LOGOUT";

export const USER_AUTH = "userAuth";
export const USER_INFO = "userInfo";
export const USER_ACCESS_TOKEN = "userAccessToken";
export const USER_EMAIL = "userEmail";
export const USER_PERMISSIONS = "userPermissions";
export const READ_MY_CALLS_PERMISSION = "read:my_calls";
export const UPDATE_MY_CALLS_PERMISSION = "update:my_calls";
export const ADD_MY_CALLS_PERMISSION = "add:my_calls";
export const READ_OTHER_CALLS_PERMISSION = "read:other_calls";
export const UPDATE_OTHER_CALLS_PERMISSION = "update:other_calls";
export const ADD_OTHER_CALLS_PERMISSION = "add:other_calls";
export const READ_USERS_PERMISSION = "read:users";
export const UPDATE_USERS_PERMISSION = "update:users";
export const ADD_USERS_PERMISSION = "add:users";
export const READ_SYSTEM_SETTINGS_PERMISSION = "read:settings";
export const UPDATE_SYSTEM_SETTINGS_PERMISSION = "update:settings";

export const USER_ALL_PERMISSIONS = [
    READ_MY_CALLS_PERMISSION,
    UPDATE_MY_CALLS_PERMISSION,
    ADD_MY_CALLS_PERMISSION,
    READ_OTHER_CALLS_PERMISSION,
    UPDATE_OTHER_CALLS_PERMISSION,
    ADD_OTHER_CALLS_PERMISSION,
    READ_USERS_PERMISSION,
    UPDATE_USERS_PERMISSION,
    ADD_USERS_PERMISSION,
    READ_SYSTEM_SETTINGS_PERMISSION,
    UPDATE_SYSTEM_SETTINGS_PERMISSION,
];

export const USER_DEFAULT_PERMISSIONS = [
    READ_MY_CALLS_PERMISSION,
    UPDATE_MY_CALLS_PERMISSION,
];

export const USER_PERMISSIONS_MAP = {
    "הקריאות שלי": {
        צפייה: READ_MY_CALLS_PERMISSION,
        עריכה: UPDATE_MY_CALLS_PERMISSION,
        הוספה: ADD_MY_CALLS_PERMISSION,
    },
    "קריאות של אחרים": {
        צפייה: READ_OTHER_CALLS_PERMISSION,
        עריכה: UPDATE_OTHER_CALLS_PERMISSION,
        הוספה: ADD_OTHER_CALLS_PERMISSION,
    },
    "ניהול משתמשים": {
        צפייה: READ_USERS_PERMISSION,
        עריכה: UPDATE_USERS_PERMISSION,
        הוספה: ADD_USERS_PERMISSION,
    },
    "הגדרות מערכת": {
        צפייה: READ_SYSTEM_SETTINGS_PERMISSION,
        עריכה: UPDATE_SYSTEM_SETTINGS_PERMISSION,
    },
};
