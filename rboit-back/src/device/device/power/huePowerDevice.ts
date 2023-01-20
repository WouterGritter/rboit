import {PowerReading} from "./powerReading";
import {CachedDevice} from "../cachedDevice";
import {DeviceType} from "../device";
import {v3} from "node-hue-api";

export class HuePowerDevice extends CachedDevice<PowerReading> {
    readonly history: PowerReading[] = [];
    readonly name: string = 'hue-devices';
    readonly type: DeviceType = 'power';

    private hub: any = undefined;

    constructor() {
        super();

        v3.api.createLocal(process.env.HUE_HUB_ADDRESS)
            .connect(process.env.HUE_USERNAME, process.env.HUE_CLIENT_KEY)
            .then(hub => {
                this.hub = hub;
                console.log('Connected to hue hub.');
            });

    }

    async getActualReading(): Promise<PowerReading> {
        return this.getHueSystemState()
            .then(reading => this.toPowerReading(reading));
    }

    private async toPowerReading(reading: HueSystemState): Promise<PowerReading> {
        let totalEstimatedPower = 0;

        reading.lights.forEach(light => totalEstimatedPower += light.estimatedPower);

        return {
            date: new Date(),
            power: totalEstimatedPower,
            source: reading,
        };
    }

    private async getHueSystemState(): Promise<HueSystemState> {
        if (this.hub === undefined) {
            throw new Error('Not connected to hue yet.');
        }

        const hueState: HueSystemState = {
            lights: [],
        };

        const lights = await this.hub.lights.getAll();
        for (let light of lights) {
            const state = await this.hub.lights.getLightState(light);

            const maxPower = this.getExpectedMaxPower(light);
            let estimatedPower = 0;
            if (state.on) {
                const brightness = isNaN(state.bri) ? 1.0 : state.bri / 254;
                estimatedPower = maxPower * brightness;
            }

            hueState.lights.push({
                name: light.name,
                type: light.type,
                modelid: light.modelid,
                maxPower: maxPower,
                on: state.on,
                brightness: !isNaN(state.bri) ? state.bri : undefined,
                estimatedPower: estimatedPower,
            });
        }

        return hueState;
    }

    private getExpectedMaxPower(light: any): number {
        if (light.modelid === 'LCG002') {
            // GU10 spot
            return 3.7;
        } else if (light.modelid === 'LWA004' || light.modelid === 'LTV001') {
            // E27 filament
            return 6;
        } else if (light.modelid === 'LCA006' || light.modelid === 'LWA001' || light.modelid === 'LWA011' || light.modelid === 'LWA017') {
            // E27 white and color || E27 white ambiance || E27 white
            return 8.6;
        } else if (light.modelid === '440400982842') {
            // Hue play
            return 7.9;
        } else if (light.modelid === 'LOM007') {
            // Smart plug
            if (light.name === 'Zoutlamp') {
                return 3.1;
            }
        }

        console.log(`[Hue light power estimation] Unsupported light found! name=${light.name}, modelid=${light.modelid}, type=${light.type}`);

        return 0;
    }
}

export declare type HueSystemState = {
    lights: LightState[];
};

export declare type LightState = {
    name: string;
    type: string;
    modelid: string;
    maxPower: number;
    on: boolean;
    brightness: number | undefined;
    estimatedPower: number;
};
