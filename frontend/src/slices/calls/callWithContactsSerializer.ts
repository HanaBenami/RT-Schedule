import callSerializer from "./callSerializer";
import contactSerializer from "./contactSerializer";

const deserializedCallWithContacts = (serializedCall: object) => {
    let call = callSerializer.deserialize(serializedCall);
    call = {
        ...call,
        contacts: call.contacts.map((serializedContact: object) =>
            contactSerializer.deserialize(serializedContact)
        ),
    };
    return call;
};

export default deserializedCallWithContacts;
