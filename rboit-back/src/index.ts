import dotenv from "dotenv";

dotenv.config();

import express from "express";
import {router} from "./router";
import {ensureRedisConnected} from "./redisClient";
import {Service} from "./service/service";
import {GoveeBatteryMonitorService} from "./service/goveeBatteryMonitorService";
import {RukbunkerEnergyLoggerService} from "./service/rukbunkerEnergyLoggerService";
import {RukbunkerSolarEnergyLoggerService} from "./service/rukbunkerSolarEnergyLoggerService";
import {AndledonSmartMeterMessageLoggerService} from "./service/andledonSmartMeterMessageLoggerService";
import {DEVICE_REPOSITORY} from "./device/deviceRepository";

(async () => {
    await ensureRedisConnected();

    const app = express();
    const port = process.env.PORT || '80';

    app.use(express.json());
    app.use(router);

    app.listen(port, () => {
        console.log(`Listening on http://0.0.0.0:${port}`);
    });

    const services: Service[] = [
        new GoveeBatteryMonitorService(),
        new RukbunkerEnergyLoggerService(),
        new RukbunkerSolarEnergyLoggerService(),
        new AndledonSmartMeterMessageLoggerService(),
    ];

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
})();
