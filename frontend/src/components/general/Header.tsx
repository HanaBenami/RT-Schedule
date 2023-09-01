import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { EventKey, SelectCallback } from "@restart/ui/esm/types";
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
    Permission,
} from "../../classes/permissions";

function Header() {
    const { currentUser, isAuthenticated, isLoading, login, logout } = useAuth();
    const [selectedPage, setSelectedPage] = useState<EventKey | null>(null);

    const appName = config.app.name ? config.app.name : "סידור עבודה";
    const logoUrl = config.app.logoUrl ? config.app.logoUrl : logo;

    type Link = {
        to: string;
        title: string;
        icon: string;
        onClick?: React.MouseEventHandler;
        requiredPermission?: Permission;
    };
    const preAuthLinks: Link[] = [
        {
            to: "login",
            title: "התחבר",
            icon: "fa-user",
            onClick: login,
        },
        {
            to: "demo",
            title: "יצירת משתמש דמו",
            icon: "fa-user",
        },
    ];

    const postAuthLinks: Link[] = [
        {
            to: "schedule",
            title: "סידור עבודה",
            icon: "fa-calendar-days",
            requiredPermission: READ_MY_CALLS_PERMISSION,
        },
        {
            to: "addCalls",
            title: "הוספת קריאות",
            icon: "fa-plus",
            requiredPermission: ADD_MY_CALLS_PERMISSION,
        },
        {
            to: "users",
            title: "ניהול משתמשים",
            icon: "fa-users",
            requiredPermission: READ_USERS_PERMISSION,
        },
        {
            to: "settings",
            title: "הגדרות מערכת",
            icon: "fa-gear",
            requiredPermission: READ_SYSTEM_SETTINGS_PERMISSION,
        },
        {
            to: "logout",
            title: "התנתק",
            icon: "fa-door-open",
            onClick: logout,
        },
    ];

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
                            activeKey={selectedPage as EventKey}
                            onSelect={setSelectedPage as SelectCallback}
                        >
                            <>
                                {(isAuthenticated && !isLoading ? postAuthLinks : preAuthLinks).map(
                                    (link) => (
                                        <RestrictedComponent
                                            key={link.to}
                                            requiredPermission={link.requiredPermission}
                                        >
                                            <LinkContainer
                                                to={`/${link.to}`}
                                                onClick={link.onClick}
                                            >
                                                <Nav.Link eventKey={link.to}>
                                                    <Icon icon={link.icon} />
                                                    {link.title}
                                                </Nav.Link>
                                            </LinkContainer>
                                        </RestrictedComponent>
                                    )
                                )}
                            </>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Sticky>
        </header>
    );
}

export default Header;
