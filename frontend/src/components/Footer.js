import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
    return (
        <footer>
            <Container fluid>
                <Row className="bg-light bg-body-tertiary" sticky="buttom">
                    <Col className="text-center">
                        Copyright &copy; Hana Oliver
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
