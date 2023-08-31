import { Contact } from "./contact";

export type Call = {
    id: number;
    customer: string;
    type: string;
    description: string;
    vehicle: string;
    address: string;
    contacts: Contact[];
    driverEmail: string;
    scheduledDate: string;
    scheduledOrder: number;
    driverNotes: string;
    isDone: boolean;
};
