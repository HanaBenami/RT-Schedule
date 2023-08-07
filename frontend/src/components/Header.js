import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Sticky from "react-sticky-el";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";

import useAuth from "../auth/useAuth";
import logo from "../rtlogo.png";
import Icon from "./Icon";
import RestrictedComponent from "./RestrictedComponent";
import {
    READ_MY_CALLS_PERMISSION,
    READ_USERS_PERMISSION,
    READ_SYSTEM_SETTINGS_PERMISSION,
    ADD_MY_CALLS_PERMISSION,
} from "../constants/userAuthConstants";
import config from "../config.json";

function Header() {
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();

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
                            <Nav.Link className="no-padding">
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
                                        {user && user.nickname}
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
                        <Nav className="mr-auto">
                            {isAuthenticated && !isLoading ? (
                                <>
                                    <RestrictedComponent
                                        requiredPermission={
                                            READ_MY_CALLS_PERMISSION
                                        }
                                    >
                                        <LinkContainer to="/schedule">
                                            <Nav.Link>
                                                <Icon icon="fa-calendar-days" />
                                                סידור עבודה
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent
                                        requiredPermission={
                                            ADD_MY_CALLS_PERMISSION
                                        }
                                    >
                                        <LinkContainer to="/addCalls">
                                            <Nav.Link>
                                                <Icon icon="fa-plus" />
                                                הוספת קריאות
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent
                                        requiredPermission={
                                            READ_USERS_PERMISSION
                                        }
                                    >
                                        <LinkContainer to="/users">
                                            <Nav.Link>
                                                <Icon icon="fa-users" />
                                                ניהול משתמשים
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <RestrictedComponent
                                        requiredPermission={
                                            READ_SYSTEM_SETTINGS_PERMISSION
                                        }
                                    >
                                        <LinkContainer to="/settings">
                                            <Nav.Link>
                                                <Icon icon="fa-gear" />
                                                הגדרות מערכת
                                            </Nav.Link>
                                        </LinkContainer>
                                    </RestrictedComponent>
                                    <LinkContainer
                                        to="/logout"
                                        onClick={logout}
                                    >
                                        <Nav.Link>
                                            <Icon icon="fa-door-open" />
                                            התנתק
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/login" onClick={login}>
                                        <Nav.Link>
                                            <Icon icon="fa-user" />
                                            התחבר
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
