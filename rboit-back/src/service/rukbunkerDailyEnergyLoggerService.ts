import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {redisGet, redisSet} from "../redisClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";
import {DTS353FReading, RukbunkerSmartMeterPowerDevice} from "../device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "../discordClient";

const KWH_PRICE = 0.67;

export class RukbunkerDailyEnergyLoggerService extends Service {

    async start(): Promise<void> {
        if (await this.getLastReading() === undefined) {
            const reading = await this.getSmartReading();
            await this.setLastReading(reading);
        }

        scheduleTask(() => this.update(), 'next-midnight', true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-smart-meter'];
    }

    private async update() {
        const currentReading = await this.getSmartReading();
        const lastReading = await this.getLastReading();
        await this.setLastReading(currentReading);

        const delivery = currentReading.energy.delivery - lastReading.energy.delivery;
        const redelivery = currentReading.energy.redelivery - lastReading.energy.redelivery;
        const total = delivery - redelivery;

        const message = `:zap: Rukbunker energy usage today
> Delivery: \`${delivery.toFixed(2)} kWh\` / \`€${(delivery * KWH_PRICE).toFixed(2)}\`
> Redelivery: \`${redelivery.toFixed(2)} kWh\` / \`€${(redelivery * KWH_PRICE).toFixed(2)}\`
> Total: \`${total.toFixed(2)} kWh\` / \`€${(total * KWH_PRICE).toFixed(2)}\``;

        await discordClient.send(message);
    }

    public async getSmartReading(): Promise<DTS353FReading> {
        const device = DEVICE_REPOSITORY.findDevice('rb-smart-meter', 'power') as RukbunkerSmartMeterPowerDevice;
        const reading = await device.getReading();
        return reading.source as DTS353FReading;
    }

    private async getLastReading(): Promise<DTS353FReading | undefined> {
        return await redisGet<DTS353FReading>('rb-total-last-reading');
    }

    private async setLastReading(value: DTS353FReading): Promise<void> {
        await redisSet<DTS353FReading>('rb-total-last-reading', value);
    }
}
