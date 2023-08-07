import React from "react";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";

import logo from "../rtlogo.png";
import config from "../config.json";

function WelcomeScreen() {
    const logoUrl = config.app.logoUrl ? config.app.logoUrl : logo;

    return (
        <Container className="my-auto" height="100%">
            <Image src={logoUrl} fluid />
        </Container>
    );
}

export default WelcomeScreen;
