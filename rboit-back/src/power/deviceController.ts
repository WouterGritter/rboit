import express from "express";
import {DEVICE_REPOSITORY} from "./deviceRepository";

export class DeviceController {

    async index(req: express.Request, res: express.Response) {
        let names = DEVICE_REPOSITORY
            .getDevices(req.params.type)
            .map(d => d.name);

        res.send(names);
    }

    async reading(req: express.Request, res: express.Response) {
        let device = DEVICE_REPOSITORY.findDevice(req.params.name, req.params.type);
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
        let device = DEVICE_REPOSITORY.findDevice(req.params.name, req.params.type);
        if (!device) {
            res.status(400);
            res.send({});
            return;
        }

        let history = device.history;
        res.send(history);
    }

    async historyConfig(req: express.Request, res: express.Response) {
        res.send(DEVICE_REPOSITORY.getHistoryConfig());
    }
}
