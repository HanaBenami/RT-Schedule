import { AppDispatch, AppState } from "../store";
import { AccessToken } from "../classes/user";
import delay from "../utils/delay";

type HttpRequestConfig = {
    headers: {
        ["Content-type"]: string;
        Authorization?: string;
    };
};

const createHttpRequestConfigImpl = (accessToken?: AccessToken): HttpRequestConfig => {
    let httpRequestConfig: HttpRequestConfig = {
        headers: {
            "Content-type": "application/json",
        },
    };

    if (accessToken !== undefined) {
        httpRequestConfig = {
            ...httpRequestConfig,
            headers: {
                ...httpRequestConfig.headers,
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    return httpRequestConfig;
};

export const createHttpRequestConfig = async (
    dispatch: AppDispatch,
    getState: () => AppState,
    isAuthRequired: boolean = true
): Promise<HttpRequestConfig> => {
    try {
        let accessToken;
        if (isAuthRequired) {
            accessToken = getState().userAuth.currentUser.accessToken;
            if (accessToken === null) {
                throw Error("The access token isn't ready");
            }
        }
        return createHttpRequestConfigImpl(accessToken);
    } catch (error) {
        await delay(1000); // wait for login to be completed and user info to be saved/restored
        return createHttpRequestConfig(dispatch, getState, isAuthRequired);
    }
};
