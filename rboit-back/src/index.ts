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

(async () => {
    await ensureRedisConnected();

    const app = express();
    const port = process.env.PORT || '80';

    const services: Service[] = [
        new GoveeBatteryMonitorService(),
        new RukbunkerEnergyLoggerService(),
        new RukbunkerSolarEnergyLoggerService(),
        new AndledonSmartMeterMessageLoggerService(),
    ];

    app.use(router);

    app.listen(port, () => {
        console.log(`Listening on http://0.0.0.0:${port}`);
    });

    services.forEach(service => service.start());
})();
