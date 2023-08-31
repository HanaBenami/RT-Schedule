import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter, selectFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
    ColumnToggle,
    // eslint-disable-next-line
    // @ts-ignore
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Button from "react-bootstrap/Button";

import useAuth from "../../auth/useAuth";
import RestrictedComponent from "../utils/RestrictedComponent";
import {
    READ_USERS_PERMISSION,
    UPDATE_USERS_PERMISSION,
    ADD_USERS_PERMISSION,
} from "../../classes/permissions";
import Icon from "../utils/Icon";
import UserLastLogin from "./UserLastLogin";
import { User } from "../../classes/user";

interface UsersTableProps {
    users: User[];
    onUserSelection: (user: User, readOnly: boolean) => void;
    onUserAddition: () => void;
}

function UsersTable({ users, onUserSelection, onUserAddition }: UsersTableProps) {
    const { currentUser, currentUserPermissions } = useAuth();

    const { ToggleList } = ColumnToggle;

    function booleanColumnFormatter(cell: boolean) {
        return <Icon icon={cell ? "fa-check" : "fa-xmark"} />;
    }

    function lastLoginColumnFormatter(_cell: unknown, row: User) {
        return <UserLastLogin user={row} />;
    }

    function editColumnFormatter(_cell: unknown, row: User) {
        const readOnly =
            !(currentUserPermissions && currentUserPermissions.includes(UPDATE_USERS_PERMISSION)) ||
            (currentUser && currentUser.email === row.email);
        return (
            <Button
                variant="dark"
                className="smallBtn"
                onClick={() => {
                    onUserSelection(row, readOnly as boolean);
                }}
            >
                <Icon icon={readOnly ? "fa-eye" : "fa-pencil"} />
            </Button>
        );
    }

    const customTextFilter = textFilter({
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
            text: `דוא"ל`,
            sort: true,
            hidden: true,
            filter: customTextFilter,
        },
        {
            dataField: "firstName",
            text: "שם פרטי",
            sort: true,
            filter: customTextFilter,
        },
        {
            dataField: "lastName",
            text: "שם משפחה",
            sort: true,
            filter: customTextFilter,
        },
        {
            dataField: "isActive",
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
            dataField: "isTemporary",
            text: "זמני",
            formatter: booleanColumnFormatter,
            filter: selectFilter({
                options: {
                    true: "V",
                    false: "X",
                },
                placeholder: " ",
            }),
        },
        {
            dataField: "lastLogin",
            text: "התחברות אחרונה",
            formatter: lastLoginColumnFormatter,
            sort: true,
            hidden: true,
        },
        {
            dataField: "createdAt",
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
        <RestrictedComponent requiredPermission={READ_USERS_PERMISSION} showError={true}>
            <ToolkitProvider keyField="pk" data={users} columns={columns} columnToggle>
                {(props: {
                    columnToggleProps: object;
                    baseProps: { keyField: string; data: typeof users; columns: typeof columns };
                }) => (
                    <>
                        <RestrictedComponent requiredPermission={ADD_USERS_PERMISSION}>
                            <Button
                                variant="dark"
                                onClick={() => {
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
