import React from "react";
import { Alert } from "react-bootstrap";
import type { Variant } from "react-bootstrap/esm/types";

interface MessageProps extends React.PropsWithChildren {
    variant: Variant;
}

function Message({ variant, children }: MessageProps) {
    return <Alert variant={variant}>{children}</Alert>;
}

export default Message;
