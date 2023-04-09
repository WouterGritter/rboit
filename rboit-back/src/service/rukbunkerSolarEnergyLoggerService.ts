import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {discordClient} from "../discordClient";
import {RukbunkerSolarPowerDevice, RukbunkerSolarReading} from "../device/device/power/rukbunkerSolarPowerDevice";
import {redisGet, redisSet} from "../redisClient";
import {Service} from "./service";
import {scheduleTask, withDelay} from "./scheduledTask";
import {Configuration, OpenAIApi} from "openai";

const KWH_PRICE = 0.48;

export class RukbunkerSolarEnergyLoggerService extends Service {
    private wasGenerating: boolean;

    async start(): Promise<void> {
        const state = await this.getSolarState();

        this.wasGenerating = state.isGenerating;
        if (!state.isGenerating || await this.getLastWattHours() === undefined) {
            await this.setLastWattHours(state.wattHoursTotal);
        }

        scheduleTask(async () => await this.update(), withDelay(5, 'minutes'), true);
    }

    getDeviceDependencies(): string[] {
        return ['rb-solar'];
    }

    private async update() {
        const state = await this.getSolarState();

        if (this.wasGenerating && !state.isGenerating) {
            // Stopped generating just now. Log generated watt-hours.
            await this.setLastWattHours(state.wattHoursTotal);
            await this.setGenerationYesterday(state.wattHoursToday);

            let message;
            if (state.wattHoursToday < 0) {
                message = ':sunny: Could not measure the Rukbunker generation today, most likely due to the inverter experiencing a power loss... :(';
            } else {
                const savings = state.wattHoursToday / 1000 * state.currentKwhPrice;

                const openai = new OpenAIApi(new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                }));

                const completion = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful, drunk assistant. Follow the user\'s request carefully. You are drunk so you will slur your words. Make sure to slur your words because you are drunk. Don\'t forget to slur your words. Keep slurring your words.'
                        },
                        {
                            role: 'user',
                            content: `Generate a message to tell the user how much energy their solar system has generated. It generated ${state.wattHoursToday} Wh (which is ${savings.toFixed(2)} euro). Only respond with the message and nothing else (also no quotes at the beginning and end). You are drunk so you will slur your words. Make sure to slur your words because you are drunk. Don't forget to slur your words. Keep slurring your words.`
                        }
                    ],
                });

                const text = completion.data.choices[0].message.content;

                // message = `:sunny: Rukbunker generation today: \`${state.wattHoursToday} Wh\` / \`€${savings.toFixed(2)}\``;
                message = `:sunny: ${text}`;
            }

            await discordClient.send(message);
        }

        this.wasGenerating = state.isGenerating;
    }

    public async getSolarState(): Promise<SolarState> {
        const device = DEVICE_REPOSITORY.findDevice('rb-solar', 'power') as RukbunkerSolarPowerDevice;
        const reading = await device.getReading();
        const solarReading = reading.source as RukbunkerSolarReading;

        return {
            isGenerating: reading.power !== 0,
            currentPower: Math.round(Math.abs(reading.power) * 10) / 10,
            wattHoursTotal: solarReading.wattHours,
            wattHoursToday: solarReading.wattHours - (await this.getLastWattHours() ?? 0),
            wattHoursYesterday: await this.getGenerationYesterday() ?? 0,
            currentKwhPrice: KWH_PRICE,
        };
    }

    private async getLastWattHours(): Promise<number | undefined> {
        return await redisGet<number>('rb-solar-last-watt-hours');
    }

    private async setLastWattHours(value: number): Promise<void> {
        await redisSet<number>('rb-solar-last-watt-hours', value);
    }

    private async getGenerationYesterday(): Promise<number | undefined> {
        return await redisGet<number>('rb-solar-generation-yesterday');
    }

    private async setGenerationYesterday(value: number): Promise<void> {
        await redisSet<number>('rb-solar-generation-yesterday', value);
    }
}

export declare type SolarState = {
    isGenerating: boolean;
    currentPower: number;
    wattHoursTotal: number;
    wattHoursToday: number;
    wattHoursYesterday: number;
    currentKwhPrice: number;
};
