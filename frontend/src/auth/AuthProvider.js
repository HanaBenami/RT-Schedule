import { Auth0Provider } from "@auth0/auth0-react";

import config from "../config.json";
import AuthProviderImpl from "./AuthProviderImpl.js";
import { USER_ALL_PERMISSIONS } from "../constants/userAuthConstants.js";

export default function AuthProvider({ children }) {
    return (
        <Auth0Provider
            domain={config.auth0.domain}
            clientId={config.auth0.clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                scope: `profile email ${USER_ALL_PERMISSIONS.join(" ")}`,
                audience: config.auth0.audience,
            }}
            cacheLocation="localstorage"
        >
            <AuthProviderImpl>{children}</AuthProviderImpl>
        </Auth0Provider>
    );
}
