import express from "express";
import {power} from "./power/powerRouter";

export const router = express.Router();

router.use('/power', power);
