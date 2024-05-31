import {Device, DeviceReading, DeviceType} from "./device";
import {DeferredPromise} from "../../util/deferredPromise";
import {MqttManager} from "../../mqttManager";
import {RegexMap} from "../../util/regexMap";

export abstract class MqttDevice<T extends DeviceReading> implements Device<T> {

    readonly abstract history: T[];
    readonly abstract name: string;
    readonly abstract type: DeviceType;

    private readyPromises: DeferredPromise<string>[] | undefined = [];

    private readonly topics: string[];

    private latestDate: Date | undefined = undefined;
    private values: MqttValues = new RegexMap();

    constructor(mqttManager: MqttManager, topics: string[]) {
        this.topics = topics;

        for (const topic of topics) {
            mqttManager.subscribe(topic, (topic, payload) => this.mqttCallback(topic, payload));
        }
    }

    private mqttCallback(topic: string, payload: string) {
        this.latestDate = new Date();
        this.values.set(topic, this.parsePayload(payload));

        if (this.readyPromises !== undefined && this.isReady()) {
            this.readyPromises.forEach(deferred => deferred.resolve(this.name));
            this.readyPromises = undefined;
        }
    }

    private parsePayload(payload: string): any {
        try {
            return JSON.parse(payload);
        } catch (e) {
            return payload;
        }
    }

    abstract translateReading(values: MqttValues, date: Date): T;

    getReading(): Promise<T> {
        if (!this.isReady()) {
            return Promise.reject(`Device ${this.name} not ready yet.`);
        }

        const reading = this.translateReading(this.values, this.latestDate);
        return Promise.resolve(reading);
    }

    isReady(): boolean {
        if (this.latestDate === undefined) {
            return false;
        }

        for (const topic of this.topics) {
            if (this.values.getExact(topic) === undefined) {
                return false;
            }
        }

        return true;
    }

    waitForReady(): Promise<string> {
        if (this.isReady()) {
            return Promise.resolve<string>(this.name);
        } else {
            if (this.readyPromises === undefined) {
                throw new Error(`Device ${this.name} not is ready, but this.readyPromises is undefined.`);
            }

            const deferred = new DeferredPromise<string>();
            this.readyPromises.push(deferred);
            return deferred.promise();
        }
    }
}

export declare type MqttValues = RegexMap<any>;
