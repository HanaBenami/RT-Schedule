export default class BiDirectionalMap {
    private _keyToValue: Map<string, string>;
    private _valueToKey: Map<string, string>;

    constructor(map: Map<string, string>) {
        this._keyToValue = new Map();
        this._valueToKey = new Map();
        for (const [key, value] of map.entries()) {
            if (value !== undefined) {
                this.set(key, value);
            }
        }
    }

    set(key: string, value: string) {
        this._keyToValue.set(key, value);
        this._valueToKey.set(value, key);
    }

    getValue(key: string): string {
        return this._keyToValue.get(key) as string;
    }

    getKey(value: string): string {
        return this._valueToKey.get(value) as string;
    }
}
