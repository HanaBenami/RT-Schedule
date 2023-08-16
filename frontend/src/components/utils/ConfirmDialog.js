import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Message from "./Message";

function ConfirmDialog({
    showConfirmDialog,
    setShowConfirmDialog,
    title,
    text,
    warning,
    onConfirm,
}) {
    const closeConfirmDialog = () => setShowConfirmDialog(false);

    return (
        <Modal show={showConfirmDialog} onHide={closeConfirmDialog} centered>
            <Modal.Header closeButton={false}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    {text}
                    {warning && <Message variant="danger">{warning}</Message>}
                </>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="dark"
                    onClick={() => {
                        closeConfirmDialog();
                    }}
                >
                    בטל
                </Button>
                <Button
                    variant="success"
                    onClick={() => {
                        onConfirm();
                        closeConfirmDialog();
                    }}
                >
                    אשר
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmDialog;
