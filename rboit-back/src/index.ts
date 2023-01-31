import dotenv from "dotenv";

dotenv.config();

import express from "express";
import {router} from "./router";
import {startGoveeBatteryMonitor} from "./goveeBatteryMonitor";
import {startRukbunkerEnergyLogger} from "./rukbunkerEnergyLogger";
import {startRukbunkerSolarEnergyLogger} from "./rukbunkerSolarEnergyLogger";
import {ensureRedisConnected} from "./redisClient";

(async () => {
    await ensureRedisConnected();

    const app = express();
    const port = process.env.PORT || '80';

    app.use(router);

    app.listen(port, () => {
        console.log(`Listening on http://0.0.0.0:${port}`);
    });

    startGoveeBatteryMonitor();
    startRukbunkerEnergyLogger();
    startRukbunkerSolarEnergyLogger();
})();
