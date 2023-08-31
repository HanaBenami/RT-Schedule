import { AsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { AppDispatch, AppState } from "../../store";
import { createHttpRequestConfig } from "../../auth/authHttpHeaders";

export type AppThunkReturned<T> = T[];
export type AppThunkArg<A> = A;
export type SerializeFunction<A> = (deserializedItem: A) => string | object;
export type DeserializeFunction<T> = (serializedItem: object) => T;
export type SortFunction<T> = (items: T[]) => void;

// T - Returned type (the returned type will be T[])
// A - Argument type
export type AppAsyncThunk<T, A = void> = AsyncThunk<
    AppThunkReturned<T>,
    AppThunkArg<A>,
    {
        state?: unknown;
        dispatch?: Dispatch;
        extra?: unknown;
        rejectValue?: unknown;
        serializedErrorType?: unknown;
        pendingMeta?: unknown;
        fulfilledMeta?: unknown;
        rejectedMeta?: unknown;
    }
>;

export function asyncThunkFactory<T, A = void>(
    sliceName: string,
    apiUrlFunction: string | ((a: A) => string),
    serializeFunction?: SerializeFunction<A>,
    desrializeFunction?: DeserializeFunction<T>,
    sortFunction?: SortFunction<T>,
    additionalDispatch?: (dispatch: AppDispatch) => void,
    isAuthRequired: boolean = true
): AppAsyncThunk<T, A> {
    return createAsyncThunk<AppThunkReturned<T>, AppThunkArg<A>>(
        sliceName,
        async (dataToPost: A, thunkAPI) => {
            const { dispatch, getState, rejectWithValue } = thunkAPI;

            try {
                const config = await createHttpRequestConfig(
                    dispatch as AppDispatch,
                    getState as () => AppState,
                    isAuthRequired
                );

                const apiUrl =
                    typeof apiUrlFunction === "string"
                        ? apiUrlFunction
                        : apiUrlFunction(dataToPost);
                let { data: serializedData } = await (dataToPost === undefined
                    ? axios.get(apiUrl, config)
                    : axios.post(
                          apiUrl,
                          serializeFunction === undefined
                              ? dataToPost
                              : serializeFunction(dataToPost),
                          config
                      ));

                if (!Array.isArray(serializedData)) {
                    serializedData = [serializedData];
                }

                const deserializedData = serializedData.map((serializedItem: object) =>
                    desrializeFunction === undefined
                        ? serializedItem
                        : desrializeFunction(serializedItem)
                );

                if (sortFunction !== undefined) {
                    sortFunction(deserializedData);
                }

                if (additionalDispatch !== undefined) {
                    additionalDispatch(dispatch as AppDispatch);
                }

                return deserializedData;
            } catch (error) {
                return rejectWithValue(error);
            }
        }
    );
}
