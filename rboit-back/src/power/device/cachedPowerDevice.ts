import {PowerDevice, PowerReading} from "./powerDevice";

const POWER_DEVICE_CACHE_MAX_AGE = parseInt(process.env.POWER_DEVICE_CACHE_MAX_AGE);
console.log(`POWER_DEVICE_CACHE_MAX_AGE=${POWER_DEVICE_CACHE_MAX_AGE}`);

export abstract class CachedPowerDevice implements PowerDevice {
    readonly history: PowerReading[];
    readonly name: string;

    private cachedReading: PowerReading | undefined;
    private cachedReadingDate: number = 0;

    async getReading(): Promise<PowerReading> {
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

    abstract getActualReading(): Promise<PowerReading>;

    private shouldRefreshCache(): boolean {
        return this.cachedReading === undefined || new Date().getTime() - this.cachedReadingDate > POWER_DEVICE_CACHE_MAX_AGE;
    }
}
