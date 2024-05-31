import mqtt, {MqttClient} from "mqtt";

export class MqttManager {

    private client: MqttClient;
    private connected: boolean = false;

    private subscribers: { [key: string]: MqttCallback } = {};

    constructor(broker: string) {
        this.client = mqtt.connect(broker);

        this.client.on('connect', () => this.onConnect());
        this.client.on('message', (topic, payload) => this.onMessage(topic, payload));
    }

    subscribe(topic: string, subscriber: MqttCallback) {
        this.subscribers[topic] = subscriber;

        if (this.connected) {
            this.client.subscribe(topic);
            console.log(`Subscribed to the ${topic} topic on MQTT.`);
        } else {
            console.log(`Subscribing to the ${topic} topic on MQTT once a connection has been made.`);
        }
    }

    private onConnect(): void {
        console.log('Successfully connected to the MQTT broker.');
        this.connected = true;

        console.log(`Subscribing to ${Object.keys(this.subscribers).length} topic(s).`);
        for (const topic in this.subscribers) {
            this.client.subscribe(topic);
        }
    }

    private onMessage(topic: string, payload: any) {
        const subscriber = this.subscribers[topic];
        if (subscriber === undefined) {
            console.log(`Received a MQTT callback for topic ${topic}, but found no subscriber subscribing to that topic.`);
            return;
        }

        subscriber(topic, payload.toString());
    }
}

export declare type MqttCallback = (topic: string, payload: string) => void;
