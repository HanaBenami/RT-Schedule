import Image from "react-bootstrap/Image";
import wazeImage from "../../images/waze.png";

interface WazeLinkProps {
    address: string;
}

function WazeLink({ address }: WazeLinkProps) {
    const wazeURL = "https://www.waze.com/ul?q=" + address.replace(/ /g, "+");

    return (
        <a href={wazeURL} target="_blank" rel="noreferrer">
            <Image src={wazeImage} height="30" />
            {address}
        </a>
    );
}

export default WazeLink;
