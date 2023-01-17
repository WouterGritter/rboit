import {Device, DeviceType} from "./device";

const DEVICE_CACHE_MAX_AGE = parseInt(process.env.DEVICE_CACHE_MAX_AGE);
console.log(`DEVICE_CACHE_MAX_AGE=${DEVICE_CACHE_MAX_AGE}`);

export abstract class CachedDevice<T> implements Device<T> {
    readonly abstract history: T[];
    readonly abstract name: string;
    readonly abstract type: DeviceType;

    private ready: boolean = false;
    private fetching: boolean = false;
    private cachedReading: T | undefined;
    private cachedReadingDate: number = 0;
    private readonly maxCacheAge: number;

    constructor(maxCacheAge?: number | undefined) {
        this.maxCacheAge = maxCacheAge || DEVICE_CACHE_MAX_AGE;

        setTimeout(() => this.performReadyRequest(), 500);
    }

    private performReadyRequest(): void {
        this.getActualReading()
            .then(reading => {
                this.cachedReading = reading;
                this.cachedReadingDate = new Date().getTime();

                this.ready = true;
                console.log(`Device ${this.name} is now ready.`);
            })
            .catch(reason => {
                console.log(`Error on first request of device ${this.name}: ${reason}`);
                console.log('Retrying in 5 seconds.');
                setTimeout(() => this.performReadyRequest(), 5000);
            });
    }

    async getReading(): Promise<T> {
        if (!this.ready) {
            return Promise.reject(`Device ${this.name} not ready yet.`);
        }

        if (this.shouldRefreshCache()) {
            if (this.fetching) {
                // TODO: Maybe somehow wait and return the result of the pending fetch?
                return Promise.resolve(this.cachedReading);
            }

            this.fetching = true;
            try{
                this.cachedReading = await retry(() => this.getActualReading());
            }catch(e) {
                this.fetching = false;
                return Promise.reject(e);
            }

            this.cachedReadingDate = new Date().getTime();
            this.fetching = false;
        }

        if (this.cachedReading === undefined) {
            return Promise.reject('Reading is undefined even after refreshing the cache.');
        }

        return Promise.resolve(this.cachedReading);
    }

    abstract getActualReading(): Promise<T>;

    private shouldRefreshCache(): boolean {
        return this.cachedReading === undefined || new Date().getTime() - this.cachedReadingDate > DEVICE_CACHE_MAX_AGE;
    }
}

async function retry<T>(task: () => Promise<T>, maxTries: number = 3): Promise<T> {
    let tries = 0;
    while (true) {
        try {
            return await task();
        }catch(e) {
            tries++;
            if (tries == maxTries) {
                throw e;
            }
        }
    }
}
