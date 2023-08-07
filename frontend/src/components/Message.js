import React from "react";

import { Alert } from "react-bootstrap";

function Message({ variant, children }) {
    return (
        <Alert variant={variant} align="center">
            {children}
        </Alert>
    );
}

export default Message;
