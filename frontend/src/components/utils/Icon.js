import React from "react";

function Icon({ icon, onClick = null }) {
    return <i className={`fa-solid ${icon}`} onClick={onClick} />;
}

export default Icon;
