import express from "express";
import {router} from "./router";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || '80';

app.use(router);

app.listen(port, () => {
    console.log(`Listening on http://0.0.0.0:${port}`);
});
