import {GoveeTemperatureDevice, GoveeTemperatureReading} from "./device/device/temperature/goveeTemperatureDevice";
import {DEVICE_REPOSITORY} from "./device/deviceRepository";
import {discordClient} from "./discordClient";

const INTERVAL = 24 * 60 * 60 * 1000; // 1 day
const BATTERY_THRESHOLD = 25;
const DEVICES = [
    'rb-temperature'
];

export function startGoveeBatteryMonitor(): void {
    console.log('Now monitoring govee battery!');
    setInterval(checkGoveeBattery, INTERVAL);
}

async function checkGoveeBattery(): Promise<void> {
    for (let device of getGoveeDevices()) {
        let reading = await device.getReading();
        let goveeReading = reading.source as GoveeTemperatureReading;

        if (goveeReading.battery <= BATTERY_THRESHOLD) {
            await discordClient.send(`:low_battery: Govee device ${device.name} has a low battery of ${goveeReading.battery}%!`);
        }
    }
}

function getGoveeDevices(): GoveeTemperatureDevice[] {
    return DEVICES
        .map(name => DEVICE_REPOSITORY.findDevice(name, 'temperature') as GoveeTemperatureDevice);
}
