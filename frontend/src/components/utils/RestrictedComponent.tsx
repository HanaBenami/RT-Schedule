import useAuth from "../../auth/useAuth";
import { Permission } from "../../classes/permissions";
import Message from "./Message";

interface RestrictedComponentProps extends React.PropsWithChildren {
    requiredPermission: Permission;
    showError?: boolean;
}

function RestrictedComponent({
    requiredPermission,
    children,
    showError = false,
}: RestrictedComponentProps) {
    const { currentUserPermissions } = useAuth();
    const hasRequiredPermission =
        currentUserPermissions && currentUserPermissions.includes(requiredPermission);

    return hasRequiredPermission ? (
        <> {children} </>
    ) : (
        <>{showError && <Message variant="danger">אין לך הרשאה מתאימה</Message>}</>
    );
}

export default RestrictedComponent;
