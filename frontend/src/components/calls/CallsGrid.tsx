import { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

import { useAppDispatch, useAppSelector } from "../../hooks";
import CallDataTable from "./CallDataTable";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import Icon from "../utils/Icon";
import { Email } from "../../classes/user";
import { Call } from "../../classes/call";
import { fetchCallsList } from "../../slices/calls/callsListSlice";

interface CallsGridProps {
    userEmail: Email;
    scheduledDate: Date;
    readOnly: boolean;
}

function CallsGrid({ userEmail, scheduledDate, readOnly = false }: CallsGridProps) {
    const dispatch = useAppDispatch();
    const callsList = useAppSelector((state) => state.callsList);
    const { status, error, items: calls } = callsList;

    const relevantCalls =
        calls &&
        calls
            .filter(
                (call: Call) =>
                    call.driverEmail === userEmail &&
                    new Date(Date.parse(call.scheduledDate)).toDateString() ===
                        scheduledDate.toDateString()
            )
            .sort((a: Call, b: Call) => (a.scheduledOrder < b.scheduledOrder ? -1 : 1));

    const [activeCallKey, setActiveCallKey] = useState<number | undefined>();

    // loading list of calls
    useEffect(() => {
        dispatch(fetchCallsList());
    }, [dispatch]);

    // reselecting the "current" call
    useEffect(() => {
        if (
            relevantCalls &&
            0 < relevantCalls.length &&
            undefined === relevantCalls.find((call: Call) => call.id === activeCallKey)
        ) {
            setActiveCallKey(relevantCalls[0].id);
        }
    }, [relevantCalls, activeCallKey]);

    return (
        <>
            {status === "loading" ? (
                <Loader />
            ) : status === "error" && error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Accordion
                    activeKey={`${relevantCalls && 0 < relevantCalls.length ? activeCallKey : 0}`}
                    onSelect={(eventKey) => {
                        if (activeCallKey !== Number(eventKey)) {
                            setActiveCallKey(Number(eventKey));
                        }
                    }}
                >
                    {relevantCalls && 0 === relevantCalls.length ? (
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div style={{ fontSize: "larger" }}>לא נמצאו קריאות</div>
                            </Accordion.Header>
                        </Accordion.Item>
                    ) : (
                        relevantCalls &&
                        relevantCalls.map((call: Call) => {
                            return (
                                <Accordion.Item eventKey={`${call.id}`} key={`${call.id}`}>
                                    <Accordion.Header>
                                        <div
                                            style={{
                                                fontSize: "larger",
                                            }}
                                        >
                                            <strong>
                                                {call.scheduledOrder}
                                                &nbsp;&nbsp;
                                            </strong>
                                        </div>
                                        <div
                                            style={{
                                                textDecoration: call.isDone
                                                    ? "line-through"
                                                    : "none",
                                            }}
                                        >
                                            {call.customer}
                                        </div>
                                        {call.isDone && <Icon icon="fa-check fa-lg" />}
                                    </Accordion.Header>
                                    <Accordion.Body className="bg-light bg-body-tertiary">
                                        <CallDataTable call={call} readOnly={readOnly} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })
                    )}
                </Accordion>
            )}
        </>
    );
}

export default CallsGrid;
