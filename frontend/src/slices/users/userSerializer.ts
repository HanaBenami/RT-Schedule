import { User } from "../../classes/user";
import Serializer from "../../utils/serializer";

const userSerializer = new Serializer<User>(
    new Map(
        Object.entries({
            pk: "pk",
            firstName: "first_name",
            lastName: "last_name",
            nickname: "nickname",
            email: "email",
            isActive: "is_active",
            isTemporary: "is_temporary",
            permissions: "permissions",
            createdAt: "created_at",
            lastLogin: "last_login",
            lastLoginUpdate: "last_login_update",
        })
    )
);

export default userSerializer;
