import React from "react";
import Image from "react-bootstrap/Image";

import phoneImage from "../../images/phone.png";
import PhoneCallLink from "../utils/PhoneCallLink";

function CallContactsTable({ contacts }) {
    const contactsTableRows = contacts.map((contact) => (
        <tr key={contact.phone}>
            <td>
                <PhoneCallLink phone={contact.phone}>
                    <Image src={phoneImage} height="30" />
                </PhoneCallLink>
            </td>
            <td>
                <PhoneCallLink phone={contact.phone}>{contact.name}</PhoneCallLink>
            </td>
            <td>
                <PhoneCallLink phone={contact.phone}>{contact.phone}</PhoneCallLink>
            </td>
        </tr>
    ));
    return (
        <table>
            <tbody>{contactsTableRows}</tbody>
        </table>
    );
}

export default CallContactsTable;
