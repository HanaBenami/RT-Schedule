import BiDirectionalMap from "./biDirectionalMap";

export default class Serializer<D, S = object> {
    // fieldsMap: key - deserialized field name, value - serialized
    private _fieldsBiDirectionalMap: BiDirectionalMap;

    constructor(fieldsMap: Map<string, string>) {
        this._fieldsBiDirectionalMap = new BiDirectionalMap(fieldsMap);
    }

    _getDeserializedFieldName(serializedFieldName: string): string {
        return this._fieldsBiDirectionalMap.getKey(serializedFieldName);
    }

    _getSerializedFieldName(deserializedFieldName: string): string {
        return this._fieldsBiDirectionalMap.getValue(deserializedFieldName);
    }

    deserialize(serializedData: S, requiredFields: string[] | null = null): D {
        const deserializedData: { [k: string]: unknown } = {};
        for (const serializedFieldName in serializedData) {
            const deserializedFieldName = this._getDeserializedFieldName(serializedFieldName);
            if (requiredFields === null || requiredFields.includes(deserializedFieldName)) {
                deserializedData[deserializedFieldName] = serializedData[serializedFieldName];
            }
        }
        return deserializedData as D;
    }

    serialize(deserializedData: D, requiredFields: string[] | null = null): S {
        const serializedData: { [k: string]: unknown } = {};
        for (const deserializedFieldName in deserializedData) {
            if (requiredFields === null || requiredFields.includes(deserializedFieldName)) {
                const serializedFieldName = this._getSerializedFieldName(deserializedFieldName);
                serializedData[serializedFieldName] = deserializedData[deserializedFieldName];
            }
        }
        return serializedData as S;
    }
}
