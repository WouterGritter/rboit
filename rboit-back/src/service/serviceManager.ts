import {Service} from "./service";
import {GoveeBatteryMonitorService} from "./goveeBatteryMonitorService";
import {RukbunkerEnergyLoggerService} from "./rukbunkerEnergyLoggerService";
import {RukbunkerSolarEnergyLoggerService} from "./rukbunkerSolarEnergyLoggerService";
import {AndledonSmartMeterMessageLoggerService} from "./andledonSmartMeterMessageLoggerService";
import {DEVICE_REPOSITORY} from "../device/deviceRepository";

export const GOVEE_BATTERY_MONITOR_SERVICE = new GoveeBatteryMonitorService();
export const RUKBUNKER_ENERGY_LOGGER_SERVICE = new RukbunkerEnergyLoggerService();
export const RUKBUNKER_SOLAR_ENERGY_LOGGER_SERVICE = new RukbunkerSolarEnergyLoggerService();
export const ANDLEDON_SMART_METER_MESSAGE_LOGGER_SERVICE = new AndledonSmartMeterMessageLoggerService();

const services: Service[] = [
    GOVEE_BATTERY_MONITOR_SERVICE,
    RUKBUNKER_ENERGY_LOGGER_SERVICE,
    RUKBUNKER_SOLAR_ENERGY_LOGGER_SERVICE,
    ANDLEDON_SMART_METER_MESSAGE_LOGGER_SERVICE,
];

export function startServices() {
    services.forEach(service => {
        const serviceName = service.constructor.name;
        console.log(`Service ${serviceName} is dependent on [${service.getDeviceDependencies()}]`);

        Promise.all(
            service.getDeviceDependencies()
                .map(name => DEVICE_REPOSITORY.findDevice(name))
                .map(device => device.waitForReady())
        ).then(() => {
            console.log(`Starting service ${serviceName}!`);
            service.start();
        });
    });
}
