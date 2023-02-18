import express from "express";
import {BroedmachineController} from "./broedmachineController";

export const broedmachineRouter = express.Router();

const controller = new BroedmachineController();

broedmachineRouter.get('/sensor', (req, res) => controller.getSensor(req, res));
broedmachineRouter.get('/fan', (req, res) => controller.getFan(req, res));
broedmachineRouter.post('/fan', (req, res) => controller.postFan(req, res));
