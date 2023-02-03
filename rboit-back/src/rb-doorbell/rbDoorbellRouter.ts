import express from "express";
import {RbDoorbellController} from "./rbDoorbellController";

export const rbDoorbellRouter = express.Router();

const controller = new RbDoorbellController();

rbDoorbellRouter.post('/chime', (req, res) => controller.chime(req, res));
