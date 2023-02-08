import express from "express";
import {deviceRouter} from "./device/deviceRouter";
import {memeRouter} from "./meme/memeRouter";
import {rbDoorbellRouter} from "./rb-doorbell/rbDoorbellRouter";
import {rbSolarRouter} from "./rb-solar/rbSolarRouter";

export const router = express.Router();

router.use('/device', deviceRouter);
router.use('/meme', memeRouter);
router.use('/rb-doorbell', rbDoorbellRouter);
router.use('/rb-solar', rbSolarRouter);
