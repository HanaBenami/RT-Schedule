import { Permission } from "./permissions";

export type Email = string | undefined | null;
export type AccessToken = string | undefined | null;

export type BasicUser = {
    email: Email;
    accessToken?: AccessToken;
};

export type User = BasicUser & {
    pk?: string;
    firstName: string;
    lastName: string;
    nickname?: string;
    isActive?: boolean;
    isTemporary?: boolean;
    permissions?: Permission[];
    createdAt?: string;
    lastLogin?: string;
    lastLoginUpdate?: string;
};
