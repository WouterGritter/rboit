import express from "express";
import {sleep} from "../util/sleep";

export class RbDoorbellController {
    private isChimeInProgress: boolean = false;

    async chime(req: express.Request, res: express.Response) {
        if (this.isChimeInProgress) {
            res.send({error: 'A chime is currently in-progress.'});
            return;
        }

        const chime = req.body as ChimeRequest;
        console.log(chime);

        res.send({error: false});

        this._chime(chime.duration, chime.interval, chime.repeat)
            .catch(reason => console.error(reason));
    }

    private async _chime(duration: number, interval: number, repeatAmount: number) {
        if (this.isChimeInProgress) {
            throw new Error('Chime in progress.');
        }

        this.isChimeInProgress = true;

        for (let i = 0; i < repeatAmount; i++) {
            fetch(`http://10.43.60.75/?duration=${duration}&t=${new Date().getTime()}`)
                .then(res => res.text())
                .then(res => {
                    if (res !== 'OK') throw Error(res)
                })
                .catch(reason => console.error(`Could not chime rb-doorbell: ${reason}`));

            await sleep(duration + interval);
        }

        this.isChimeInProgress = false;
    }
}

declare type ChimeRequest = {
    duration: number;
    interval: number;
    repeat: number;
};
