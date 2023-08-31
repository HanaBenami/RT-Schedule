import { asyncThunkFactory } from "../generics/asyncThunkFactory";
import { sliceFactory } from "../generics/sliceFactory";
import { User } from "../../classes/user";
import userSerializer from "./userSerializer";

const sliceName = "users/fetchList";

const sortUsers = (users: User[]) => {
    users.sort((a: User, b: User) => a.lastName.localeCompare(b.lastName));
    users.sort((a: User, b: User) => a.firstName.localeCompare(b.firstName));
};

export const fetchUsersList = asyncThunkFactory<User>(
    sliceName,
    "/api/users/list",
    undefined,
    (user) => userSerializer.deserialize(user),
    sortUsers
);

export const slice = sliceFactory<User>(sliceName, fetchUsersList);

export default slice.reducer;
