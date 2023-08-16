import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";

import { listCalls } from "../../actions/callAction";
import CallDataTable from "./CallDataTable";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import Icon from "../utils/Icon";

function CallsGrid({ userEmail, scheduledDate, readOnly = false }) {
    const dispatch = useDispatch();
    const callsList = useSelector((state) => state.callsList);
    const { loading, error, calls } = callsList;

    const relevantCalls =
        calls &&
        calls
            .filter(
                (call) =>
                    call.driverEmail === userEmail &&
                    new Date(Date.parse(call.scheduledDate)).toDateString() ===
                        scheduledDate.toDateString()
            )
            .sort((a, b) => (a.scheduledOrder < b.scheduledOrder ? -1 : 1));

    const [activeCallKey, setActiveCallKey] = useState();

    // loading list of calls
    useEffect(() => {
        dispatch(listCalls());
    }, [dispatch]);

    // reselecting the "current" call
    useEffect(() => {
        if (
            relevantCalls &&
            0 < relevantCalls.length &&
            undefined === relevantCalls.find((call) => call.id === activeCallKey)
        ) {
            setActiveCallKey(relevantCalls[0].id);
        }
    }, [relevantCalls, activeCallKey]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Accordion
                    activeKey={relevantCalls && 0 < relevantCalls.length ? activeCallKey : 0}
                    onSelect={(eventKey) => {
                        if (activeCallKey !== eventKey) {
                            setActiveCallKey(eventKey);
                        }
                    }}
                >
                    {relevantCalls && 0 === relevantCalls.length ? (
                        <Accordion.Item eventKey={0}>
                            <Accordion.Header>
                                <font style={{ fontSize: "larger" }}>לא נמצאו קריאות</font>
                            </Accordion.Header>
                        </Accordion.Item>
                    ) : (
                        relevantCalls &&
                        relevantCalls.map((call) => {
                            return (
                                <Accordion.Item eventKey={call.id} key={call.id}>
                                    <Accordion.Header>
                                        <font
                                            style={{
                                                fontSize: "larger",
                                            }}
                                        >
                                            <strong>
                                                {call.scheduledOrder}
                                                &nbsp;&nbsp;
                                            </strong>
                                        </font>
                                        <font
                                            style={{
                                                textDecoration: call.isDone
                                                    ? "line-through"
                                                    : "none",
                                            }}
                                        >
                                            {call.customer}
                                        </font>
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
