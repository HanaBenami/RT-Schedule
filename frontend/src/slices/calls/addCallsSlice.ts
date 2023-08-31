import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { AppDispatch } from "../../store";
import { Call } from "../../classes/call";
import deserializedCallWithContacts from "./callWithContactsSerializer";
import { fetchCallsList } from "./callsListSlice";

const sliceName = "calls/addCalls";

export const addCalls: AppAsyncThunk<Call, string> = asyncThunkFactory<Call, string>(
    sliceName,
    `/api/calls/add`,
    undefined,
    deserializedCallWithContacts,
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchCallsList())
);

export const slice = sliceFactory<Call, string>(sliceName, addCalls);

export default slice.reducer;
