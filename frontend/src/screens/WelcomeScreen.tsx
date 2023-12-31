import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";

import logo from "../images/rtlogo.png";
import config from "../config.json";

function WelcomeScreen() {
    const logoUrl = config.app.logoUrl ? config.app.logoUrl : logo;

    return (
        <Container className="my-auto">
            <Image src={logoUrl} fluid />
        </Container>
    );
}

export default WelcomeScreen;
