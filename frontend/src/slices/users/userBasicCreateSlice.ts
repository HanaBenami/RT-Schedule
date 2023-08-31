import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { User } from "../../classes/user";
import userSerializer from "./userSerializer";
import { AppDispatch } from "../../store";
import { fetchUsersList } from "./usersListSlice";

const sliceName = "users/createBasicUser";

export const createBasicUser: AppAsyncThunk<User, User> = asyncThunkFactory<User, User>(
    sliceName,
    () => `/api/users/create/basic/`,
    (user: User) => userSerializer.serialize(user, ["firstName", "lastName", "email"]),
    (user) => userSerializer.deserialize(user),
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchUsersList()),
    false
);

export const slice = sliceFactory<User, User>(sliceName, createBasicUser);

export default slice.reducer;
