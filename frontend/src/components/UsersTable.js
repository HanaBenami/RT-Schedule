import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
    textFilter,
    selectFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
    ColumnToggle,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Button from "react-bootstrap/Button";

import useAuth from "../auth/useAuth";
import RestrictedComponent from "../components/RestrictedComponent";
import {
    READ_USERS_PERMISSION,
    UPDATE_USERS_PERMISSION,
    ADD_USERS_PERMISSION,
} from "../constants/userAuthConstants";
import Icon from "../components/Icon";
import UserLastLogin from "./UserLastLogin";

function UsersTable({ users, onUserEdit, onUserAddition }) {
    const { user: currentUser, permissions } = useAuth();

    const { ToggleList } = ColumnToggle;

    function booleanColumnFormatter(cell, row) {
        return <Icon icon={cell ? "fa-check" : "fa-xmark"} />;
    }

    function lastLoginColumnFormatter(cell, row) {
        return <UserLastLogin user={row} />;
    }

    function editColumnFormatter(cell, row) {
        const readOnly =
            !(permissions && permissions.includes(UPDATE_USERS_PERMISSION)) ||
            (currentUser && currentUser.email === row.email);
        return (
            <Button
                variant="dark"
                className="smallBtn"
                onClick={(e) => {
                    onUserEdit(row, readOnly);
                }}
            >
                <Icon icon={readOnly ? "fa-eye" : "fa-pencil"} />
            </Button>
        );
    }

    const customTextFilter = textFilter({
        type: "TextFilter",
        placeholder: " ",
    });

    const customPagination = paginationFactory({
        hideSizePerPage: true,
        sizePerPageList: [
            {
                text: "5",
                value: 5,
            },
        ],
    });

    const columns = [
        {
            dataField: "email",
            text: 'דוא"ל',
            sort: true,
            hidden: true,
            filter: customTextFilter,
            style: {
                wordBreak: "break-all",
            },
        },
        {
            dataField: "first_name",
            text: "שם פרטי",
            sort: true,
            filter: customTextFilter,
        },
        {
            dataField: "last_name",
            text: "שם משפחה",
            sort: true,
            filter: customTextFilter,
        },
        {
            dataField: "is_active",
            text: "פעיל",
            formatter: booleanColumnFormatter,
            filter: selectFilter({
                options: {
                    true: "V",
                    false: "X",
                },
                placeholder: " ",
                defaultValue: true,
            }),
        },
        {
            dataField: "last_login",
            text: "התחברות אחרונה",
            formatter: lastLoginColumnFormatter,
            sort: true,
            hidden: true,
        },
        {
            dataField: "added_at",
            text: "תאריך הוספה",
            sort: true,
            hidden: true,
        },
        {
            dataField: "",
            text: "עריכה",
            isDummyField: true,
            formatter: editColumnFormatter,
        },
    ];

    return (
        <RestrictedComponent
            requiredPermission={READ_USERS_PERMISSION}
            showError={true}
        >
            <ToolkitProvider
                keyField="pk"
                data={users}
                columns={columns}
                columnToggle
            >
                {(props) => (
                    <>
                        <RestrictedComponent
                            requiredPermission={ADD_USERS_PERMISSION}
                        >
                            <Button
                                variant="dark"
                                onClick={(e) => {
                                    onUserAddition();
                                }}
                            >
                                <Icon icon="fa-plus" />
                                הוסף משתמש
                            </Button>
                        </RestrictedComponent>
                        <ToggleList
                            contextual="dark"
                            style={{
                                margin: 10,
                            }}
                            width="50%"
                            className="toggleList"
                            btnClassName="smallBtn"
                            {...props.columnToggleProps}
                        />
                        <BootstrapTable
                            {...props.baseProps}
                            filter={filterFactory()}
                            pagination={customPagination}
                            bordered={false}
                            hover
                            condensed
                            noDataIndication="לא נמצאו משתמשים"
                        />
                    </>
                )}
            </ToolkitProvider>
        </RestrictedComponent>
    );
}

export default UsersTable;
