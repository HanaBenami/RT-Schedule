import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import jwt from "jwt-decode";

import AuthContext from "./AuthContext.js";
import { saveUserInfo, resetUserInfo } from "../actions/userAuthActions.js";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();

    const {
        error: auth0error,
        isLoading: auth0IsLoading,
        isAuthenticated: auth0IsAuthenticated,
        user,
        getAccessTokenSilently,
        loginWithRedirect: auth0login,
        logout: auth0logout,
    } = useAuth0();

    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const isLoading = internalIsLoading || auth0IsLoading;

    const [internalIsAuthenticated, setInternalIsAuthenticated] =
        useState(false);
    const isAuthenticated = internalIsAuthenticated && auth0IsAuthenticated;

    const [internalError, setInternalError] = useState(null);
    const error = auth0error
        ? auth0error
        : internalError
        ? internalError
        : null;

    const [accessToken, setAccessToken] = useState(null);
    const permissions = accessToken && jwt(accessToken)["permissions"];

    const handleError = useCallback((error) => {
        const errorMessage =
            error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
        setInternalError((prevInternalError) =>
            prevInternalError
                ? prevInternalError + "; " + errorMessage
                : errorMessage
        );
    }, []);

    const login = useCallback(async () => {
        setInternalIsAuthenticated(false);
        setInternalIsLoading(true);
        await auth0login();
    }, [auth0login]);

    const logout = useCallback(async () => {
        setInternalIsAuthenticated(false);
        setInternalIsLoading(true);
        await auth0logout({
            logoutParams: { returnTo: window.location.origin },
        });
    }, [auth0logout]);

    const getAccessToken = useCallback(async () => {
        var newAccessToken = accessToken;
        if (null == newAccessToken) {
            try {
                newAccessToken = await getAccessTokenSilently();
                setAccessToken(newAccessToken);
            } catch (error) {
                handleError(error);
            }
        }

        return newAccessToken;
    }, [accessToken, getAccessTokenSilently, handleError]);

    useEffect(() => {
        async function handleLoginOrLogout() {
            if (auth0IsAuthenticated) {
                const accessToken = await getAccessToken();
                dispatch(saveUserInfo(user, accessToken));
                setInternalIsAuthenticated(true);
            } else {
                dispatch(resetUserInfo());
                setAccessToken(null);
                setInternalError(null);
            }
            setInternalIsLoading(false);
        }

        handleLoginOrLogout();
    }, [user, auth0IsAuthenticated, dispatch, getAccessToken]);

    const map = {
        // State
        error,
        isAuthenticated,
        isLoading,
        user,
        permissions,
        // Auth methods
        login,
        logout,
        getAccessToken,
    };

    return <AuthContext.Provider value={map}>{children}</AuthContext.Provider>;
}
