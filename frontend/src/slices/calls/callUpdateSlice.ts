import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { AppDispatch } from "../../store";
import { Call } from "../../classes/call";
import callSerializer from "./callSerializer";
import deserializedCallWithContacts from "./callWithContactsSerializer";
import { fetchCallsList } from "./callsListSlice";

const sliceName = "calls/updateCall";

export const updateCall: AppAsyncThunk<Call, Call> = asyncThunkFactory<Call, Call>(
    sliceName,
    (call: Call) => `/api/calls/update/${call.id}`,
    (call: Call) => callSerializer.serialize(call, ["id", "driverNotes", "isDone"]),
    deserializedCallWithContacts,
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchCallsList())
);

export const slice = sliceFactory<Call, Call>(sliceName, updateCall);

export const { reset } = slice.actions;

export default slice.reducer;
