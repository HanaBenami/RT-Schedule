import { Container, Row, Col, Spinner } from "react-bootstrap";

interface LoaderProps {
    size?: number;
}

function Loader({ size = 100 }: LoaderProps) {
    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <Row>
                    <Col align="left">
                        <Spinner
                            animation="border"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                display: "block",
                            }}
                        />
                    </Col>
                    <Col className="d-flex align-items-center justify-content-right">
                        <h5>אנא המתן...</h5>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Loader;
