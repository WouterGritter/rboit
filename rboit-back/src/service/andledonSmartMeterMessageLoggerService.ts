import {Service} from "./service";
import {scheduleTask, withDelay} from "./scheduledTask";
import {DEVICE_REPOSITORY} from "../device/deviceRepository";
import {PowerReading} from "../device/device/power/powerReading";
import {AndledonSmartMeterReading} from "../device/device/power/andledonSmartMeterPowerDevice";
import {discordClient} from "../discordClient";

export class AndledonSmartMeterMessageLoggerService extends Service {
    private lastMessage: string = '';

    start() {
        scheduleTask(async () => await this.checkForNewMessage(), withDelay(10, 'seconds'), true);
    }

    getDeviceDependencies(): string[] {
        return ['andledon-smart-meter'];
    }

    private async checkForNewMessage() {
        const currMessage = await this.getCurrentMessage();
        if (currMessage !== this.lastMessage) {
            this.lastMessage = currMessage;

            if (currMessage !== '') {
                const message = `:boom: Received a text message from Greenchoice on the smart meter!\n> ${currMessage}`;
                await discordClient.send(message);
            }
        }
    }

    private async getCurrentMessage(): Promise<string> {
        const reading = await DEVICE_REPOSITORY.findDevice<PowerReading>('andledon-smart-meter', 'power')
            .getReading()
            .then(reading => reading.source as AndledonSmartMeterReading);

        return reading.text_message;
    }
}
