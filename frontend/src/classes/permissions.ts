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
] as const;

export type Permission = (typeof USER_ALL_PERMISSIONS)[number];

export const USER_DEFAULT_PERMISSIONS: Permission[] = USER_ALL_PERMISSIONS.filter((permission) =>
    permission.startsWith("read")
).concat([UPDATE_MY_CALLS_PERMISSION, ADD_MY_CALLS_PERMISSION]);

type PermissionsGroup = {
    title: string;
    permissions: {
        view?: Permission;
        edit?: Permission;
        add?: Permission;
    };
};

export const USER_PERMISSIONS_KEYS_TO_TITLE = new Map();
USER_PERMISSIONS_KEYS_TO_TITLE.set("view", "הצגה");
USER_PERMISSIONS_KEYS_TO_TITLE.set("edit", "עריכה");
USER_PERMISSIONS_KEYS_TO_TITLE.set("add", "הוספה");

export const USER_PERMISSIONS_MAP: PermissionsGroup[] = [
    {
        title: "הקריאות שלי",
        permissions: {
            view: READ_MY_CALLS_PERMISSION,
            edit: UPDATE_MY_CALLS_PERMISSION,
            add: ADD_MY_CALLS_PERMISSION,
        },
    },
    {
        title: "קריאות של אחרים",
        permissions: {
            view: READ_OTHER_CALLS_PERMISSION,
            edit: UPDATE_OTHER_CALLS_PERMISSION,
            add: ADD_OTHER_CALLS_PERMISSION,
        },
    },
    {
        title: "ניהול משתמשים",
        permissions: {
            view: READ_USERS_PERMISSION,
            edit: UPDATE_USERS_PERMISSION,
            add: ADD_USERS_PERMISSION,
        },
    },
    {
        title: "הגדרות מערכת",
        permissions: {
            view: READ_SYSTEM_SETTINGS_PERMISSION,
            edit: UPDATE_SYSTEM_SETTINGS_PERMISSION,
        },
    },
];
