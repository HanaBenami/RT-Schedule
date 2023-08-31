import { Setting } from "../../classes/setting";
import Serializer from "../../utils/serializer";

const settingSerializer = new Serializer<Setting>(
    new Map(
        Object.entries({
            key: "key",
            description: "description",
            value: "value",
        })
    )
);

export default settingSerializer;
