import express from "express";
import {DeviceController} from "./deviceController";

export const deviceRouter = express.Router();

const controller = new DeviceController();

deviceRouter.get('/:type/names', (req, res) => controller.index(req, res));
deviceRouter.get('/:type/reading/:name', (req, res) => controller.reading(req, res));
deviceRouter.get('/:type/history/:name', (req, res) => controller.history(req, res));
deviceRouter.get('/historyConfig', (req, res) => controller.historyConfig(req, res));
