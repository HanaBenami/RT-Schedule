import { User } from "@auth0/auth0-spa-js";
import { Permission } from "../classes/permissions";

export type AuthState = {
    // Auth state:
    error: Error | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    currentUser: User | undefined;
    currentUserPermissions: Permission[];
    // Auth methods:
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string | null>;
};
