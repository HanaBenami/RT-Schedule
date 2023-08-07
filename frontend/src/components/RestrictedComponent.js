import useAuth from "../auth/useAuth";
import Message from "./Message";

function RestrictedComponent({
    requiredPermission,
    children,
    showError = false,
}) {
    const { permissions } = useAuth();
    const hasRequiredPermission =
        permissions && permissions.includes(requiredPermission);

    return hasRequiredPermission ? (
        <> {children} </>
    ) : (
        <>
            {showError && (
                <Message variant="danger">אין לך הרשאה מתאימה</Message>
            )}
        </>
    );
}

export default RestrictedComponent;
