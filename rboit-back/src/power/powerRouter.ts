import express from "express";
import {PowerController} from "./powerController";

export const power = express.Router();

const controller = new PowerController();

power.get('/names', (req, res) => controller.index(req, res));
power.get('/reading/:name', (req, res) => controller.reading(req, res));
power.get('/history/:name', (req, res) => controller.history(req, res));
power.get('/historyConfig', (req, res) => controller.historyConfig(req, res));
