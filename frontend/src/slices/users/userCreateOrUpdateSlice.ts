import { AppAsyncThunk, asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { User } from "../../classes/user";
import userSerializer from "./userSerializer";
import { AppDispatch } from "../../store";
import { fetchUsersList } from "./usersListSlice";

const sliceName = "users/createOrUpdateUser";

export const createOrUpdateUser: AppAsyncThunk<User, User> = asyncThunkFactory<User, User>(
    sliceName,
    (user: User) => (user.pk ? `/api/users/update/${user.pk}` : `/api/users/create/`),
    (user: User) =>
        userSerializer.serialize(user, [
            "firstName",
            "lastName",
            "email",
            "isActive",
            "isTemporary",
            "permissions",
        ]),
    (user) => userSerializer.deserialize(user),
    undefined,
    (dispatch: AppDispatch) => dispatch(fetchUsersList())
);

export const slice = sliceFactory<User, User>(sliceName, createOrUpdateUser);

export default slice.reducer;
