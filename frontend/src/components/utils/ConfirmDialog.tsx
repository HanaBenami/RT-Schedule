import { Dispatch, SetStateAction } from "react";
import { Modal, Button } from "react-bootstrap";

import Message from "./Message";

interface ConfirmDialogProps {
    showConfirmDialog: boolean;
    setShowConfirmDialog: Dispatch<SetStateAction<boolean>>;
    title: string;
    text: string;
    warning: string;
    onConfirm: () => void;
}

function ConfirmDialog({
    showConfirmDialog,
    setShowConfirmDialog,
    title,
    text,
    warning,
    onConfirm,
}: ConfirmDialogProps) {
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
