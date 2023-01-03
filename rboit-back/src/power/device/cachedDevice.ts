import {Device} from "./device";

const DEVICE_CACHE_MAX_AGE = parseInt(process.env.DEVICE_CACHE_MAX_AGE);
console.log(`DEVICE_CACHE_MAX_AGE=${DEVICE_CACHE_MAX_AGE}`);

export abstract class CachedDevice<T> implements Device<T> {
    readonly abstract history: T[];
    readonly abstract name: string;
    readonly abstract type: 'power' | 'temperature';

    private cachedReading: T | undefined;
    private cachedReadingDate: number = 0;
    private readonly maxCacheAge: number;

    constructor(maxCacheAge?: number | undefined) {
        this.maxCacheAge = maxCacheAge || DEVICE_CACHE_MAX_AGE;
    }

    async getReading(): Promise<T> {
        if (this.shouldRefreshCache()) {
            try{
                this.cachedReading = await this.getActualReading();
            }catch(e) {
                return Promise.reject(e);
            }

            this.cachedReadingDate = new Date().getTime();
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
