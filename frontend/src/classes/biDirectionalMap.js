export default class BiDirectionalMap {
    constructor(map) {
        this._keyToValue = new Map();
        this._valueToKey = new Map();
        for (let key in map) {
            this.set(key, map[key]);
        }
    }

    set(key, value) {
        this._keyToValue[key] = value;
        this._valueToKey[value] = key;
    }

    getValue(key) {
        return this._keyToValue[key];
    }

    getKey(value) {
        return this._valueToKey[value];
    }
}
