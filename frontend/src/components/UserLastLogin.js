import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Icon from "./Icon";

function UserLastLogin({ user }) {
    return (
        user && (
            <>
                <OverlayTrigger
                    trigger="hover"
                    placement="auto"
                    overlay={
                        <Tooltip key={`last_login_tooltip_${user.email}`}>
                            עודכן לאחרונה ב-
                            {user.last_login_update}
                        </Tooltip>
                    }
                >
                    <span>
                        {user.last_login ? user.last_login : "טרם התחבר למערכת"}
                        <Icon icon="fa-question-circle" />
                    </span>
                </OverlayTrigger>
            </>
        )
    );
}

export default UserLastLogin;
