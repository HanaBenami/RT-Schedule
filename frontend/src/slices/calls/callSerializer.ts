import { Call } from "../../classes/call";
import Serializer from "../../utils/serializer";

const callSerializer = new Serializer<Call>(
    new Map(
        Object.entries({
            id: "external_id",
            customer: "customer",
            type: "type",
            description: "description",
            vehicle: "vehicle",
            address: "address",
            contacts: "contacts",
            driverEmail: "driver_email",
            scheduledDate: "scheduled_date",
            scheduledOrder: "scheduled_order",
            driverNotes: "driver_notes",
            isDone: "is_done",
        })
    )
);

export default callSerializer;
