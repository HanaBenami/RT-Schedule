import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { AppDispatch } from "../../store";
import { fetchCallsList } from "./callsListSlice";

const sliceName = "calls/getAddCallsExample";

export const getAddCallsExample: AppAsyncThunk<string> = asyncThunkFactory<string>(
    sliceName,
    `/api/calls/add/example`,
    undefined,
    undefined,
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchCallsList())
);

export const slice = sliceFactory<string>(sliceName, getAddCallsExample);

export default slice.reducer;
