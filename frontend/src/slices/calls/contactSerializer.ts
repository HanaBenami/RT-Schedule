import { Contact } from "../../classes/contact";
import Serializer from "../../utils/serializer";

const contactSerializer = new Serializer<Contact>(
    new Map(
        Object.entries({
            phone: "phone",
            name: "name",
        })
    )
);

export default contactSerializer;
