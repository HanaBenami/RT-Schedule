import BiDirectionalMap from "./biDirectionalMap";

export default class Serializer {
    // fieldsMap: key - deserialized field name, value - serialized
    constructor(fieldsMap) {
        this.fieldsBiDirectionalMap = new BiDirectionalMap(fieldsMap);
    }

    _getDeserializedFieldName(serializedFieldName) {
        return this.fieldsBiDirectionalMap.getKey(serializedFieldName);
    }

    _getSerializedFieldName(deserializedFieldName) {
        return this.fieldsBiDirectionalMap.getValue(deserializedFieldName);
    }

    deserialize(serializedData, requiredFields = null) {
        let deserializedData = {};
        for (let serializedFieldName in serializedData) {
            let deserializedFieldName =
                this._getDeserializedFieldName(serializedFieldName);
            if (
                requiredFields === null ||
                requiredFields.includes(deserializedFieldName)
            ) {
                deserializedData[deserializedFieldName] =
                    serializedData[serializedFieldName];
            }
        }
        return deserializedData;
    }

    serialize(deserializedData, requiredFields = null) {
        let serializedData = {};
        for (let deserializedFieldName in deserializedData) {
            if (
                requiredFields === null ||
                requiredFields.includes(deserializedFieldName)
            ) {
                let serializedFieldName = this._getSerializedFieldName(
                    deserializedFieldName
                );
                serializedData[serializedFieldName] =
                    deserializedData[deserializedFieldName];
            }
        }
        return serializedData;
    }
}
