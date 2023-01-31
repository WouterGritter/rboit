import {GoveeTemperatureDevice, GoveeTemperatureReading} from "../device/device/temperature/goveeTemperatureDevice";
import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {discordClient} from "../discordClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";

export class GoveeBatteryMonitorService extends Service {
    private batteryThreshold: number = 25;
    private deviceNames: string[] = [
        'rb-temp-woonkamer',
        'rb-temp-slaapkamer',
    ];

    start(): void {
        console.log('Now monitoring govee battery!');
        scheduleTask(() => this.checkGoveeBattery(), 'next-midnight', true);
    }

    private async checkGoveeBattery(): Promise<void> {
        const devices = this.deviceNames.map(name => DEVICE_REPOSITORY.findDevice(name, 'temperature') as GoveeTemperatureDevice);

        for (let device of devices) {
            let reading = await device.getReading();
            let goveeReading = reading.source as GoveeTemperatureReading;

            if (goveeReading.battery <= this.batteryThreshold) {
                await discordClient.send(`:low_battery: Govee device ${device.name} has a low battery of ${goveeReading.battery}%!`);
            }
        }
    }
}
