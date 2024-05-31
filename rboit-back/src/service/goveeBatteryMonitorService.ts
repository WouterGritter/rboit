import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {discordClient} from "../discordClient";
import {Service} from "./service";
import {scheduleTask} from "./scheduledTask";
import {GoveeTemperatureDevice} from "../device/device/temperature/goveeTemperatureDevice";
import {MqttValues} from "../device/device/mqttDevice";

export class GoveeBatteryMonitorService extends Service {
    private batteryThreshold: number = 25;
    private deviceNames: string[] = [
        'rb-temp-woonkamer',
        'rb-temp-slaapkamer',
        'rb-temp-server-room',
    ];

    start(): void {
        scheduleTask(async () => await this.checkGoveeBattery(), 'next-midnight', true);
    }

    getDeviceDependencies(): string[] {
        return this.deviceNames;
    }

    private async checkGoveeBattery(): Promise<void> {
        const devices = this.deviceNames.map(name => DEVICE_REPOSITORY.findDevice(name, 'temperature') as GoveeTemperatureDevice);

        for (let device of devices) {
            let reading = await device.getReading();
            let goveeReading = reading.source as MqttValues;

            if (goveeReading.get('.*/battery') <= this.batteryThreshold) {
                await discordClient.send(`:low_battery: Govee device ${device.name} has a low battery of ${goveeReading.get('.*/battery')}%!`);
            }
        }
    }
}
