import express from "express";
import {MemeController} from "./memeController";

export const memeRouter = express.Router();

const controller = new MemeController();

memeRouter.get('/random', (req, res) => controller.random(req, res));
