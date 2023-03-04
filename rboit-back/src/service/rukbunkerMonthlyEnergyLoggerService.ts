import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {DTS353FReading, RukbunkerSmartMeterPowerDevice} from "../device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "../discordClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";

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
        const smartMeterReading = reading.source as DTS353FReading;

        const message = `:robot: It's the first of the month! Here's an overview of the energy usage in the Rukbunker.
> Delivery: ${smartMeterReading.energy.delivery.toFixed(2)} kWh
> Redelivery: ${smartMeterReading.energy.redelivery.toFixed(2)} kWh
> Total: ${smartMeterReading.energy.total.toFixed(2)} kWh`;

        await discordClient.send(message);
    }
}
