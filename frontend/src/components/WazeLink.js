import React from "react";
import Image from "react-bootstrap/Image";
import wazeImage from "../images/waze.png";

function WazeLink({ address }) {
    var wazeURL = "https://www.waze.com/ul?q=" + address.replace(/ /g, "+");

    return (
        <a href={wazeURL} target="_blank" rel="noreferrer">
            <Image src={wazeImage} height="30" />
            {address}
        </a>
    );
}

export default WazeLink;
