import dotenv from "dotenv";

dotenv.config();

import express from "express";
import {router} from "./router";
import {ensureRedisConnected} from "./redisClient";
import {startServices} from "./service/serviceManager";

(async () => {
    await ensureRedisConnected();

    const app = express();
    const port = process.env.PORT || '80';

    app.use(router);

    app.listen(port, () => {
        console.log(`Listening on http://0.0.0.0:${port}`);
    });

    startServices();
})();
