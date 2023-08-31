import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import jwt from "jwt-decode";

import AuthContext from "./AuthContext";
import { useAppDispatch } from "../hooks";
import { AuthState } from "./authState";
import {
    userLoginRequest,
    userLoginFailure,
    userLoginSuccess,
    userLogout,
} from "../slices/users/userAuthSlice";
import { type AccessToken, BasicUser } from "../classes/user";
import serializeError, { DeserializedError, SerializedError } from "../utils/serializeError";

interface accessTokenWithPermissions {
    permissions: string[];
}

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const dispatch = useAppDispatch();

    const {
        error: auth0error,
        isLoading: auth0IsLoading,
        isAuthenticated: auth0IsAuthenticated,
        user: currentUser,
        getAccessTokenSilently,
        loginWithRedirect: auth0login,
        logout: auth0logout,
    } = useAuth0();

    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const isLoading = internalIsLoading || auth0IsLoading;

    const [internalIsAuthenticated, setInternalIsAuthenticated] = useState(false);
    const isAuthenticated = internalIsAuthenticated && auth0IsAuthenticated;

    const [internalError, setInternalError] = useState<SerializedError>(null);
    const error = auth0error ? auth0error : internalError ? internalError : null;

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const currentUserPermissions =
        accessToken && (jwt(accessToken) as accessTokenWithPermissions)["permissions"];

    const handleError = useCallback((error: DeserializedError) => {
        const newInternalError = serializeError(error);
        setInternalError((prevInternalError) =>
            prevInternalError ? prevInternalError + "; " + newInternalError : newInternalError
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
        let newAccessToken: AccessToken = accessToken;
        if (null == newAccessToken) {
            try {
                newAccessToken = await getAccessTokenSilently();
                setAccessToken(newAccessToken);
            } catch (error) {
                handleError(error as DeserializedError);
            }
        }

        return newAccessToken;
    }, [accessToken, getAccessTokenSilently, handleError]);

    useEffect(() => {
        async function handleLoginOrLogout() {
            if (auth0IsAuthenticated) {
                dispatch({ type: userLoginRequest });
                try {
                    const accessToken = await getAccessToken();
                    if (null == currentUser || null == accessToken) {
                        throw new Error("User info is missing");
                    }
                    const user: BasicUser = {
                        email: currentUser.email,
                        accessToken: accessToken,
                    };
                    dispatch({ type: userLoginSuccess, payload: user });
                    setInternalIsAuthenticated(true);
                } catch (error) {
                    dispatch({
                        type: userLoginFailure,
                        payload: serializeError(error as DeserializedError),
                    });
                }
            } else {
                dispatch({ type: userLogout });
                setAccessToken(null);
                setInternalError(null);
            }
            setInternalIsLoading(false);
        }

        handleLoginOrLogout();
    }, [currentUser, auth0IsAuthenticated, dispatch, getAccessToken]);

    const map = {
        // State
        error,
        isAuthenticated,
        isLoading,
        currentUser,
        currentUserPermissions,
        // Auth methods
        login,
        logout,
        getAccessToken,
    } as AuthState;

    return <AuthContext.Provider value={map}>{children}</AuthContext.Provider>;
}
