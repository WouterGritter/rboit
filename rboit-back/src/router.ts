import express from "express";
import {deviceRouter} from "./device/deviceRouter";
import {memeRouter} from "./meme/memeRouter";

export const router = express.Router();

router.use('/device', deviceRouter);
router.use('/meme', memeRouter);
