import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {discordClient} from "../discordClient";
import {RukbunkerSolarPowerDevice, RukbunkerSolarReading} from "../device/device/power/rukbunkerSolarPowerDevice";
import {redisGet, redisSet} from "../redisClient";
import {Service} from "./service";
import {scheduleTask, withDelay} from "./scheduledTask";

const KWH_PRICE = 0.67;

export class RukbunkerSolarEnergyLoggerService extends Service {
    private wasGenerating: boolean;

    async start(): Promise<void> {
        const state = await this.getSolarState();

        this.wasGenerating = state.isGenerating;
        if (!state.isGenerating || await this.getLastWattHours() === undefined) {
            await this.setLastWattHours(state.wattHours);
        }

        scheduleTask(() => this.update(), withDelay(5, 'minutes'), true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-solar'];
    }

    private async update() {
        const state = await this.getSolarState();

        if (this.wasGenerating && !state.isGenerating) {
            // Stopped generating just now. Log generated watt-hours.
            const wattHoursToday = state.wattHours - await this.getLastWattHours();
            await this.setLastWattHours(state.wattHours);

            let message;
            if (wattHoursToday < 0) {
                message = ':sunny: Could not measure the Rukbunker generation today, most likely due to the inverter experiencing a power loss... :(';
            } else {
                const wattHoursTodayEuros = wattHoursToday / 1000 * KWH_PRICE;
                message = `:sunny: Rukbunker generation today: \`${wattHoursToday}\` Wh / €\`${wattHoursTodayEuros.toFixed(2)}\``;
            }

            await discordClient.send(message);
        }

        this.wasGenerating = state.isGenerating;
    }

    private async getSolarState(): Promise<{ isGenerating: boolean, wattHours: number }> {
        const device = DEVICE_REPOSITORY.findDevice('rb-solar', 'power') as RukbunkerSolarPowerDevice;
        const reading = await device.getReading();
        const solarReading = reading.source as RukbunkerSolarReading;

        return {
            isGenerating: reading.power !== 0,
            wattHours: solarReading.wattHours,
        };
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
