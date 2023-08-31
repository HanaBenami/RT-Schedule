import { asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { Call } from "../../classes/call";
import deserializedCallWithContacts from "./callWithContactsSerializer";

const sliceName = "calls/fetchList";

const sortCalls = (calls: Call[]) => {
    calls.sort((a: Call, b: Call) => (a.id < b.id ? -1 : 1));
};

export const fetchCallsList = asyncThunkFactory<Call>(
    sliceName,
    "/api/calls/list",
    undefined,
    deserializedCallWithContacts,
    sortCalls
);

export const slice = sliceFactory<Call>(sliceName, fetchCallsList);

export default slice.reducer;
