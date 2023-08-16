import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { listUsers } from "../../actions/userManagmentActions";
import Loader from "../utils/Loader";
import Message from "../utils/Message";

function UserPicker({ selectedUserEmail, setSelectedUserEmail }) {
    const dispatch = useDispatch();
    const usersList = useSelector((state) => state.usersList);
    const { loading, error, users } = usersList;

    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    return loading ? (
        <Loader />
    ) : error ? (
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
                users.map((user) => (
                    <option value={user.email} key={user.email}>
                        {user.nickname}
                    </option>
                ))}
        </Form.Select>
    );
}

export default UserPicker;
