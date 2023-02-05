import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {discordClient} from "../discordClient";
import {RukbunkerSolarPowerDevice, RukbunkerSolarReading} from "../device/device/power/rukbunkerSolarPowerDevice";
import {redisGet, redisSet} from "../redisClient";
import {sleep} from "../util/sleep";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";

export class RukbunkerSolarEnergyLoggerService extends Service {
    async start(): Promise<void> {
        if (await this.getLastWattHours() === undefined) {
            await sleep(30 * 1000); // Wait for device to be ready...

            console.log('Last rukbunker total solar energy generation was not present in redis. Loading value from device...');
            const totalWattHours = await this.getTotalRBSolarWattHours();
            await this.setLastWattHours(totalWattHours);
        }

        scheduleTask(() => this.logRukbunkerSolarGeneration(), 'next-midnight', true);
    }

    private async logRukbunkerSolarGeneration() {
        const totalWattHours = await this.getTotalRBSolarWattHours();
        const wattHoursToday = totalWattHours - await this.getLastWattHours();
        await this.setLastWattHours(totalWattHours);

        let message;
        if (wattHoursToday < 0) {
            message = ':sunny: Could not measure the Rukbunker generation today, most likely due to the inverter experiencing a power loss... :(';
        } else {
            message = `:sunny: Rukbunker generation today: \`${wattHoursToday}\` Wh`;
        }

        await discordClient.send(message);
    }

    private async getTotalRBSolarWattHours(): Promise<number> {
        const device = DEVICE_REPOSITORY.findDevice('rb-solar', 'power') as RukbunkerSolarPowerDevice;
        const reading = await device.getReading();
        const solarReading = reading.source as RukbunkerSolarReading;
        return solarReading.wattHours;
    }

    private async getLastWattHours(): Promise<number | undefined> {
        const value = await redisGet<number>('rb-solar-last-watt-hours');
        console.log(`Loaded last rukbunker total solar energy generation from redis: ${value / 1000} kWh`);
        return value;
    }

    private async setLastWattHours(value: number): Promise<void> {
        await redisSet<number>('rb-solar-last-watt-hours', value);
        console.log(`Stored last rukbunker total solar energy generation to redis: ${value / 1000} kWh`);
    }
}
