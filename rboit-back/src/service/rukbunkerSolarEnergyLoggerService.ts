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
            await this.setLastWattHours(state.wattHoursTotal);
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
            await this.setLastWattHours(state.wattHoursTotal);
            await this.setGenerationYesterday(state.wattHoursToday);

            let message;
            if (state.wattHoursToday < 0) {
                message = ':sunny: Could not measure the Rukbunker generation today, most likely due to the inverter experiencing a power loss... :(';
            } else {
                message = `:sunny: Rukbunker generation today: \`${state.wattHoursToday} Wh\` / \`€${state.savingsToday.toFixed(2)}\``;
            }

            await discordClient.send(message);
        }

        this.wasGenerating = state.isGenerating;
    }

    public async getSolarState(): Promise<SolarState> {
        const device = DEVICE_REPOSITORY.findDevice('rb-solar', 'power') as RukbunkerSolarPowerDevice;
        const reading = await device.getReading();
        const solarReading = reading.source as RukbunkerSolarReading;

        const wattHoursToday = solarReading.wattHours - (await this.getLastWattHours() ?? 0);
        const wattHoursYesterday = await this.getGenerationYesterday() ?? 0;

        return {
            isGenerating: reading.power !== 0,
            currentPower: Math.abs(reading.power),
            wattHoursTotal: solarReading.wattHours,
            wattHoursToday: wattHoursToday,
            savingsToday: Math.round(wattHoursToday / 1000 * KWH_PRICE * 100) / 100,
            wattHoursYesterday: wattHoursYesterday,
            savingsYesterday: Math.round(wattHoursYesterday / 1000 * KWH_PRICE * 100) / 100,
        };
    }

    private async getLastWattHours(): Promise<number | undefined> {
        return await redisGet<number>('rb-solar-last-watt-hours');
    }

    private async setLastWattHours(value: number): Promise<void> {
        await redisSet<number>('rb-solar-last-watt-hours', value);
    }

    private async getGenerationYesterday(): Promise<number | undefined> {
        return await redisGet<number>('rb-solar-generation-yesterday');
    }

    private async setGenerationYesterday(value: number): Promise<void> {
        await redisSet<number>('rb-solar-generation-yesterday', value);
    }
}

export declare type SolarState = {
    isGenerating: boolean;
    currentPower: number;
    wattHoursTotal: number;
    wattHoursToday: number;
    savingsToday: number;
    wattHoursYesterday: number;
    savingsYesterday: number;
};
