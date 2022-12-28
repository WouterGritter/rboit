import express from "express";
import {POWER_REPOSITORY} from "./powerRepository";

export class PowerController {

    async index(req: express.Request, res: express.Response) {
        let names = POWER_REPOSITORY
            .getDevices()
            .map(d => d.name);

        res.send(names);
    }

    async reading(req: express.Request, res: express.Response) {
        let device = POWER_REPOSITORY.findDevice(req.params.name);
        if (!device) {
            res.status(400);
            res.send({});
            return;
        }

        let reading = await device.getReading()
            .catch(console.error);

        if (!reading) {
            res.status(500);
            res.send({});
            return;
        }

        res.send(reading);
    }

    async history(req: express.Request, res: express.Response) {
        let device = POWER_REPOSITORY.findDevice(req.params.name);
        if (!device) {
            res.status(400);
            res.send({});
            return;
        }

        let history = device.history;
        res.send(history);
    }

    async historyConfig(req: express.Request, res: express.Response) {
        res.send(POWER_REPOSITORY.getHistoryConfig());
    }
}
