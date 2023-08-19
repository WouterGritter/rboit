import express from "express";
import {DEVICE_REPOSITORY} from "./deviceRepository";
import {DeviceType} from "./device/device";

export class DeviceController {

    async index(req: express.Request, res: express.Response) {
        let names = DEVICE_REPOSITORY
            .getDevices(req.params.type as DeviceType)
            .map(d => d.name);

        res.send(names);
    }

    async reading(req: express.Request, res: express.Response) {
        let device = DEVICE_REPOSITORY.findDevice(req.params.name, req.params.type as DeviceType);
        if (!device) {
            res.status(400);
            res.send({
                error: `Invalid device name`
            });
            return;
        }

        try {
            const reading = await device.getReading();
            res.send(reading);
        } catch (error) {
            console.error(`Error while getting reading for device ${device.name}: ${error}`);
            res.status(500);
            res.send({
                error: error.toString(),
            });
            return;
        }
    }

    async history(req: express.Request, res: express.Response) {
        let device = DEVICE_REPOSITORY.findDevice(req.params.name, req.params.type as DeviceType);
        if (!device) {
            res.status(400);
            res.send({
                error: 'invalid device name'
            });
            return;
        }

        let history = device.history;

        const start = new Date(req.query.startDate as string | undefined);
        if (!isNaN(start.getTime())) {
            history = history.filter(x => x.date > start);
        }

        const end = new Date(req.query.endDate as string | undefined);
        if (!isNaN(end.getTime())) {
            history = history.filter(x => x.date < end);
        }

        res.send(history);
    }

    async historyConfig(req: express.Request, res: express.Response) {
        res.send(DEVICE_REPOSITORY.getHistoryConfig());
    }
}
