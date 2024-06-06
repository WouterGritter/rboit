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
            const reading = await device.getReading();
            const goveeReading = reading.source as MqttValues;
            const batteryPercentage = Math.round(goveeReading.get('.*/battery') * 100);

            if (batteryPercentage <= this.batteryThreshold) {
                await discordClient.send(`:low_battery: Govee device ${device.name} has a low battery of ${batteryPercentage}%!`);
            }
        }
    }
}
