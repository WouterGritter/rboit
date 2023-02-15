import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {redisGet, redisSet} from "../redisClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";
import {DTS353FReading, RukbunkerSmartMeterPowerDevice} from "../device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "../discordClient";

const KWH_PRICE = 0.67;

export class RukbunkerDailyEnergyLoggerService extends Service {

    async start(): Promise<void> {
        if (await this.getLastWattHours() === undefined) {
            const reading = await this.getCurrentTotalWattHours();
            await this.setLastWattHours(reading);
        }

        scheduleTask(() => this.update(), 'next-midnight', true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-smart-meter'];
    }

    private async update() {
        const currentReading = await this.getCurrentTotalWattHours();
        const usageToday = currentReading - await this.getLastWattHours();
        await this.setLastWattHours(currentReading);

        const cost = usageToday * KWH_PRICE;
        const message = `:zap: Rukbunker energy usage today: \`${usageToday} kWh\` / \`€${cost}\``;

        await discordClient.send(message);
    }

    public async getSmartReading(): Promise<DTS353FReading> {
        const device = DEVICE_REPOSITORY.findDevice('rb-smart-meter', 'power') as RukbunkerSmartMeterPowerDevice;
        const reading = await device.getReading();
        return reading.source as DTS353FReading;
    }

    public async getCurrentTotalWattHours(): Promise<number> {
        const reading = await this.getSmartReading();
        return reading.energy.total;
    }

    private async getLastWattHours(): Promise<number | undefined> {
        return await redisGet<number>('rb-total-last-watt-hours');
    }

    private async setLastWattHours(value: number): Promise<void> {
        await redisSet<number>('rb-total-last-watt-hours', value);
    }
}
