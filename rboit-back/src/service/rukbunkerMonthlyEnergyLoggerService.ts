import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {RukbunkerSmartMeterPowerDevice} from "../device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "../discordClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";
import {MqttValues} from "../device/device/mqttDevice";

export class RukbunkerMonthlyEnergyLoggerService extends Service {
    start(): void {
        scheduleTask(async () => await this.logRukbunkerEnergyUsage(), 'next-month', true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-smart-meter'];
    }

    private async logRukbunkerEnergyUsage(): Promise<void> {
        const device = DEVICE_REPOSITORY.findDevice('rb-smart-meter', 'power') as RukbunkerSmartMeterPowerDevice;
        const reading = await device.getReading();
        const smartMeterReading = reading.source as MqttValues;

        const message = `:robot: It's the first of the month! Here's an overview of the energy usage in the Rukbunker.
> Delivery: ${smartMeterReading.get('.*/energy/delivery').toFixed(2)} kWh
> Redelivery: ${smartMeterReading.get('.*/energy/redelivery').toFixed(2)} kWh
> Total: ${smartMeterReading.get('.*/energy/total').toFixed(2)} kWh`;

        await discordClient.send(message);
    }
}
