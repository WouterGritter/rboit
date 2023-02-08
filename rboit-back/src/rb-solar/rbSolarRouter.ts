import express from "express";
import {RbSolarController} from "./rbSolarController";

export const rbSolarRouter = express.Router();

const controller = new RbSolarController();

rbSolarRouter.get('/state', (req, res) => controller.state(req, res));
