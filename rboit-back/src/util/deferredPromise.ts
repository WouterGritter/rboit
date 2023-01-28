export class DeferredPromise<T> {
    private readonly _promise: Promise<T>;

    private _resolve: (value: T) => void;
    private _reject: (reason: any) => void;

    public constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public promise(): Promise<T> {
        return this._promise;
    }

    public resolve(value: T): void {
        this._resolve(value);
    }

    public reject(reason?: any): void {
        this._reject(reason);
    }
}
