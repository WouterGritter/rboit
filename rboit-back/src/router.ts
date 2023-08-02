import express from "express";
import {deviceRouter} from "./device/deviceRouter";
import {memeRouter} from "./meme/memeRouter";
import {rbDoorbellRouter} from "./rb-doorbell/rbDoorbellRouter";
import {rbSolarRouter} from "./rb-solar/rbSolarRouter";
import {broedmachineRouter} from "./broedmachine/broedmachineRouter";
import {createProxyMiddleware} from "http-proxy-middleware";

export const router = express.Router();

router.use('/audio-led', createProxyMiddleware({
    target: 'http://10.43.60.248:1337',
    changeOrigin: true,
    pathRewrite: {
        '^/audio-led': '',
    },
}));

router.use(express.json());

router.use('/device', deviceRouter);
router.use('/meme', memeRouter);
router.use('/rb-doorbell', rbDoorbellRouter);
router.use('/rb-solar', rbSolarRouter);
router.use('/broedmachine', broedmachineRouter);
