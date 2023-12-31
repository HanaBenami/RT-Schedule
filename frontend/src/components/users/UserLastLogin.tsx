import { OverlayTrigger, Tooltip } from "react-bootstrap";

import Icon from "../utils/Icon";
import { User } from "../../classes/user";

interface UserLastLoginProps {
    user: User;
}

function UserLastLogin({ user }: UserLastLoginProps) {
    return (
        user && (
            <>
                <OverlayTrigger
                    trigger="hover"
                    placement="auto"
                    overlay={
                        <Tooltip key={`lastLoginTooltip.${user.email}`}>
                            עודכן לאחרונה ב-
                            {user.lastLoginUpdate}
                        </Tooltip>
                    }
                >
                    <span>
                        {user.lastLogin ? user.lastLogin : "טרם התחבר למערכת"}
                        <Icon icon="fa-question-circle" />
                    </span>
                </OverlayTrigger>
            </>
        )
    );
}

export default UserLastLogin;
