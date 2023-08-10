import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";

import { updateCall } from "../actions/callAction";
import WazeLink from "./WazeLink";
import ContactsTable from "./ContactsTable";
import Loader from "./Loader";
import Message from "./Message";
import ConfirmDialog from "./ConfirmDialog";

function CallDataTable({ call, readOnly = false }) {
    const dispatch = useDispatch();
    const callUpdate = useSelector((state) => state.callUpdate);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [driverNotesChange, setdriverNotesChange] = useState(false);

    return (
        <>
            {call && (
                <>
                    <ConfirmDialog
                        showConfirmDialog={showConfirmDialog}
                        setShowConfirmDialog={setShowConfirmDialog}
                        title={`${call.scheduled_order} ${call.customer}`}
                        text={`האם אתה בטוח שברצונך לסגור את הקריאה של הלקוח 
                              ${call.customer}?`}
                        warning={
                            driverNotesChange
                                ? "שים לב! לא שמרת את הערותייך."
                                : ""
                        }
                        onConfirm={() => {
                            dispatch(
                                updateCall({
                                    ...call,
                                    is_done: true,
                                })
                            );
                        }}
                    />
                    <table width="100%" className="borderBottomRows">
                        <tbody>
                            <tr>
                                <td>סוג</td>
                                <td>{call.type}</td>
                            </tr>
                            <tr>
                                <td>תיאור</td>
                                <td>{call.description}</td>
                            </tr>
                            <tr>
                                <td>כלי</td>
                                <td>{call.vehicle}</td>
                            </tr>
                            <tr>
                                <td>כתובת</td>
                                <td>
                                    <WazeLink address={call.address} />
                                </td>
                            </tr>
                            <tr>
                                <td>אנשי קשר</td>
                                <td>
                                    <ContactsTable contacts={call.contacts} />
                                </td>
                            </tr>
                            <tr>
                                <td>הערות הנהג</td>
                                <td>
                                    <textarea
                                        id={`driverNotesTextArea${call.external_id}`}
                                        defaultValue={call.driver_notes}
                                        style={{ width: "100%" }}
                                        disabled={readOnly}
                                        onChange={() =>
                                            setdriverNotesChange(true)
                                        }
                                    />
                                </td>
                            </tr>
                            {!readOnly && (
                                <tr style={{ borderBottomWidth: 0 }}>
                                    <td
                                        style={{ paddingTop: 5 }}
                                        colSpan={2}
                                        align="center"
                                    >
                                        <table width="80%">
                                            <tbody>
                                                <tr>
                                                    <td align="right">
                                                        <Button
                                                            name="saveDriverNotesButton"
                                                            className="lessPadding"
                                                            variant="dark"
                                                            onClick={() => {
                                                                dispatch(
                                                                    updateCall({
                                                                        ...call,
                                                                        driver_notes:
                                                                            document.getElementById(
                                                                                `driverNotesTextArea${call.external_id}`
                                                                            )
                                                                                .value,
                                                                    })
                                                                );
                                                                setdriverNotesChange(
                                                                    false
                                                                );
                                                            }}
                                                            disabled={
                                                                !driverNotesChange
                                                            }
                                                        >
                                                            שמור הערות
                                                        </Button>
                                                    </td>
                                                    <td align="left">
                                                        {call.is_done ? (
                                                            <Button
                                                                className="lessPadding"
                                                                variant="dark"
                                                            >
                                                                הקריאה סגורה
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="lessPadding"
                                                                variant="success"
                                                                onClick={() => {
                                                                    setShowConfirmDialog(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                סגור קריאה
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                                {callUpdate.loading ? (
                                                    <tr>
                                                        <td colSpan="2">
                                                            <Loader size="40" />
                                                        </td>
                                                    </tr>
                                                ) : callUpdate.error ? (
                                                    <tr>
                                                        <td colSpan="2">
                                                            <Message variant="danger">
                                                                {
                                                                    callUpdate.error
                                                                }
                                                            </Message>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <></>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
}

export default CallDataTable;
