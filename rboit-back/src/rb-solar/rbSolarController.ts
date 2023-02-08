import express from "express";
import {RUKBUNKER_SOLAR_ENERGY_LOGGER_SERVICE} from "../service/serviceManager";

export class RbSolarController {

    private solarService = RUKBUNKER_SOLAR_ENERGY_LOGGER_SERVICE;

    async state(req: express.Request, res: express.Response) {
        try {
            const state = await this.solarService.getSolarState();
            res.send(state);
        } catch (err) {
            res.status(400);
            res.send({
                error: err,
            })
        }
    }
}
