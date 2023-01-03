import express from "express";
import {deviceRouter} from "./power/deviceRouter";

export const router = express.Router();

router.use('/device', deviceRouter);
