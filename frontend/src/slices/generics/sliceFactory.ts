import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { castDraft } from "immer";

import { AppAsyncThunk } from "./asyncThunkFactory";
import serializeError, {
    DeserializedError,
    type SerializedError,
} from "../../utils/serializeError";

export type State<T> = {
    status: "idle" | "loading" | "success" | "error";
    error: SerializedError;
    items: T[];
};

export type AppSlice<T> = Slice<State<T>, SliceCaseReducers<State<T>>, string>;

export function sliceFactory<T, A = void>(
    sliceName: string,
    asyncThunk: AppAsyncThunk<T, A>
): AppSlice<T> {
    const initialState: State<T> = {
        status: "idle",
        error: null,
        items: [],
    };

    const slice = createSlice<State<T>, SliceCaseReducers<State<T>>, string>({
        name: sliceName,
        initialState,
        reducers: {
            reset: () => initialState,
        },
        extraReducers: (builder) => {
            builder.addCase(asyncThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            });
            builder.addCase(asyncThunk.fulfilled, (state, action) => {
                state.status = "success";
                state.error = null;
                state.items = castDraft(action.payload);
            });
            builder.addCase(asyncThunk.rejected, (state, action) => {
                state.status = "error";
                state.error = serializeError(action.payload as DeserializedError);
            });
        },
    });

    return slice;
}
