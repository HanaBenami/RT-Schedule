import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Sticky from "react-sticky-el";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";

import config from "../../config.json";
import logo from "../../images/rtlogo.png";
import Icon from "../utils/Icon";
import useAuth from "../../auth/useAuth";
import RestrictedComponent from "../utils/RestrictedComponent";
import {
    READ_MY_CALLS_PERMISSION,
    READ_USERS_PERMISSION,
    READ_SYSTEM_SETTINGS_PERMISSION,
    ADD_MY_CALLS_PERMISSION,
} from "../../constants/userAuthConstants";

function Header() {
    const { currentUser, isAuthenticated, isLoading, login, logout } = useAuth();
    const [selectedPage, setSelectedPage] = useState();

    const appName = config.app.name ? config.app.name : "סידור עבודה";
    const logoUrl = config.app.logoUrl ? config.app.logoUrl : logo;

    return (
        <header>
            <Sticky>
                <Navbar
                    sticky="top"
                    expand={false}
                    className="bg-light bg-body-tertiary"
                    collapseOnSelect
                >
                    <>
                        <LinkContainer to="/">
                            <Nav.Link
                                className="no-padding"
                                eventKey="home"
                                onClick={() => setSelectedPage(null)}
                            >
                                <Navbar.Brand>
                                    <Image src={logoUrl} height="30" />
                                    {appName}
                                </Navbar.Brand>
                            </Nav.Link>
                        </LinkContainer>
                        <Navbar.Text>
                            {isAuthenticated ? (
                                isLoading ? (
                                    <Button>אנא המתן...</Button>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-user" />
                                        {currentUser && currentUser.nickname}
                                    </>
                                )
                            ) : (
                                <LinkContainer to="/login" onClick={login}>
                                    <Button>התחבר</Button>
                                </LinkContainer>
                            )}
                        </Navbar.Text>
                    </>
                    <Navbar.Toggle aria-controls="navbarCollapse" />
                    <Navbar.Collapse id="navbarCollapse">
                        <Nav
                            className="mr-auto"
                            activeKey={selectedPage}
                            onSelect={setSelectedPage}
                        >
                            {isAuthenticated && !isLoading ? (
                                <>
                                    <RestrictedComponent
                                        requiredPermission={READ_MY_CALLS_PERMISSION}
                                    >
                                        <LinkContainer to="/schedule">
                                            <Nav.Link eventKey="schedule">
                                                <Icon icon="fa-calendar-days" />
                                                סידור עבודה
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent
                                        requiredPermission={ADD_MY_CALLS_PERMISSION}
                                    >
                                        <LinkContainer to="/addCalls">
                                            <Nav.Link eventKey="addCalls">
                                                <Icon icon="fa-plus" />
                                                הוספת קריאות
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent requiredPermission={READ_USERS_PERMISSION}>
                                        <LinkContainer to="/users">
                                            <Nav.Link eventKey="users">
                                                <Icon icon="fa-users" />
                                                ניהול משתמשים
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent
                                        requiredPermission={READ_SYSTEM_SETTINGS_PERMISSION}
                                    >
                                        <LinkContainer to="/settings">
                                            <Nav.Link eventKey="settings">
                                                <Icon icon="fa-gear" />
                                                הגדרות מערכת
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <LinkContainer to="/logout" onClick={logout}>
                                        <Nav.Link>
                                            <Icon icon="fa-door-open" />
                                            התנתק
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/login" onClick={login}>
                                        <Nav.Link eventKey="login">
                                            <Icon icon="fa-user" />
                                            התחבר
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/demo">
                                        <Nav.Link eventKey="demo">
                                            <Icon icon="fa-user" />
                                            יצירת משתמש דמו
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Sticky>
        </header>
    );
}

export default Header;
