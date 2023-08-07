import React from "react";

function PhoneCallLink({ phone, children }) {
    var phoneCallURL = "tel:" + phone.replace(/[-\s]/g, "");

    return (
        <a href={phoneCallURL} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

export default PhoneCallLink;
