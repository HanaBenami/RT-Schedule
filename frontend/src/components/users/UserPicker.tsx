import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { Email, User } from "../../classes/user";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import { fetchUsersList } from "../../slices/users/usersListSlice";

interface UserPickerProps {
    selectedUserEmail: Email;
    setSelectedUserEmail: React.Dispatch<React.SetStateAction<Email>>;
}

function UserPicker({ selectedUserEmail, setSelectedUserEmail }: UserPickerProps) {
    const dispatch = useAppDispatch();
    const usersList = useAppSelector((state) => state.usersList);
    const { status, error, items: users } = usersList;

    useEffect(() => {
        dispatch(fetchUsersList());
    }, [dispatch]);

    return status === "loading" ? (
        <Loader />
    ) : status === "error" && error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <Form.Select
            id="selectedUserCombobox"
            aria-label=""
            value={selectedUserEmail ? selectedUserEmail : ""}
            onChange={(e) => {
                setSelectedUserEmail(e.target.value);
            }}
            style={{ marginBottom: 12 }}
        >
            {users &&
                users.map((user: User) => (
                    <option value={user.email as string} key={user.email as string}>
                        {user.nickname}
                    </option>
                ))}
        </Form.Select>
    );
}

export default UserPicker;
