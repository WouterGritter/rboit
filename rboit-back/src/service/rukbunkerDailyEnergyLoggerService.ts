import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {redisGet, redisSet} from "../redisClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";
import {RukbunkerSmartMeterPowerDevice} from "../device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "../discordClient";
import {MqttValues} from "../device/device/mqttDevice";

const KWH_PRICE = parseFloat(process.env.KWH_PRICE);

export class RukbunkerDailyEnergyLoggerService extends Service {

    async start(): Promise<void> {
        if (await this.getLastReading() === undefined) {
            const reading = await this.getSmartReading();
            await this.setLastReading(reading);
        }

        scheduleTask(async () => await this.update(), 'next-midnight', true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-smart-meter'];
    }

    private async update() {
        const currentReading = await this.getSmartReading();
        const lastReading = await this.getLastReading();
        await this.setLastReading(currentReading);

        const delivery = currentReading.delivery - lastReading.delivery;
        const redelivery = currentReading.redelivery - lastReading.redelivery;
        const total = delivery - redelivery;

        const message = `:zap: Rukbunker energy usage today
> Delivery: \`${delivery.toFixed(2)} kWh\` / \`€${(delivery * KWH_PRICE).toFixed(2)}\`
> Redelivery: \`${redelivery.toFixed(2)} kWh\` / \`€${(redelivery * KWH_PRICE).toFixed(2)}\`
> Total: \`${total.toFixed(2)} kWh\` / \`€${(total * KWH_PRICE).toFixed(2)}\``;

        await discordClient.send(message);
    }

    public async getSmartReading(): Promise<EnergySnapshot> {
        const device = DEVICE_REPOSITORY.findDevice('rb-smart-meter', 'power') as RukbunkerSmartMeterPowerDevice;
        const reading = (await device.getReading()).source as MqttValues;

        return {
            delivery: reading.get('.*/energy/delivery'),
            redelivery: reading.get('.*/energy/redelivery'),
        }
    }

    private async getLastReading(): Promise<EnergySnapshot | undefined> {
        const reading = await redisGet<EnergySnapshot>('rb-total-last-reading');
        if (!reading || !reading.delivery || !reading.redelivery) {
            return undefined;
        }

        return reading;
    }

    private async setLastReading(value: EnergySnapshot): Promise<void> {
        await redisSet<EnergySnapshot>('rb-total-last-reading', value);
    }
}

declare type EnergySnapshot = {
    delivery: number;
    redelivery: number;
}
