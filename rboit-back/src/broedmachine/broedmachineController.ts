import express from "express";
import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {BroedmachineTemperatureDevice} from "../device/device/temperature/broedmachineTemperatureDevice";

export class BroedmachineController {
    async getSensor(req: express.Request, res: express.Response) {
        const reading = await this.device.getBroedmachineReading();

        res.send({
            temperature: reading.temperature,
            humidity: reading.humidity,
        });
    }

    async getFan(req: express.Request, res: express.Response) {
        const reading = await this.device.getBroedmachineReading();

        res.send({
            fan_rpm: reading.fan_rpm,
            fan_speed: reading.fan_speed,
        });
    }

    async postFan(req: express.Request, res: express.Response) {
        const request = req.body as FanRequest;

        try {
            await this.device.setFanSpeed(request.fan_speed);
            res.send({set_speed: request.fan_speed});
        } catch (e) {
            res.send({error: e.toString()});
        }
    }

    private get device(): BroedmachineTemperatureDevice {
        return DEVICE_REPOSITORY.findDevice('broedmachine-temp', 'temperature') as BroedmachineTemperatureDevice;
    }
}

declare type FanRequest = {
    fan_speed: number;
};
