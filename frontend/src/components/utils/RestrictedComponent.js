import useAuth from "../../auth/useAuth";
import Message from "./Message";

function RestrictedComponent({ requiredPermission, children, showError = false }) {
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
