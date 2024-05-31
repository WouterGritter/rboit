export class RegexMap<T> implements Map<string, T> {

    private readonly backend: Map<string, T>;

    constructor(entries?: readonly (readonly [string, T])[] | null) {
        this.backend = new Map<string, T>(entries);
    }

    toJSON(): { [key: string]: T; } {
        const result: { [key: string]: T; } = {};

        for (const [key, value] of this.backend) {
            result[key] = value;
        }

        return result;
    }

    delete(keyRegex: string): boolean {
        return this.deleteRegex(new RegExp(keyRegex));
    }

    get(keyRegex: string): T | undefined {
        return this.getRegex(new RegExp(keyRegex));
    }

    has(keyRegex: string): boolean {
        return this.hasRegex(new RegExp(keyRegex));
    }

    deleteRegex(keyRegex: RegExp): boolean {
        let deletedAny = false;
        for (const [key, value] of this.backend) {
            if (keyRegex.test(key)) {
                this.backend.delete(key);
                deletedAny = true;
            }
        }

        return deletedAny;
    }

    getRegex(keyRegex: RegExp): T {
        for (const [key, value] of this.backend) {
            if (keyRegex.test(key)) {
                return value;
            }
        }

        return undefined;
    }

    getManyRegex(keyRegex: RegExp): T[] {
        const result: T[] = [];
        for (const [key, value] of this.backend) {
            if (keyRegex.test(key)) {
                result.push(value);
            }
        }

        return result;
    }

    hasRegex(keyRegex: RegExp): boolean {
        for (const [key, value] of this.backend) {
            if (keyRegex.test(key)) {
                return true;
            }
        }

        return false;
    }

    deleteExact(key: string): boolean {
        return this.backend.delete(key);
    }

    getExact(key: string): T | undefined {
        return this.backend.get(key);
    }

    hasExact(key: string): boolean {
        return this.backend.has(key);
    }

    set(key: string, value: T): this {
        this.backend.set(key, value);
        return this;
    }

    [Symbol.iterator](): IterableIterator<[string, T]> {
        return this.backend[Symbol.iterator]();
    }

    clear(): void {
        this.backend.clear()
    }

    entries(): IterableIterator<[string, T]> {
        return this.backend.entries();
    }

    forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
        this.backend.forEach(callbackfn, thisArg);
    }

    keys(): IterableIterator<string> {
        return this.backend.keys();
    }

    values(): IterableIterator<T> {
        return this.backend.values();
    }

    get [Symbol.toStringTag](): string {
        return this.backend[Symbol.toStringTag];
    }

    get size(): number {
        return this.backend.size;
    }
}