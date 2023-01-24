import {DEVICE_REPOSITORY} from "./device/deviceRepository";
import {DTS353FReading, RukbunkerSmartMeterPowerDevice} from "./device/device/power/rukbunkerSmartMeterPowerDevice";
import {discordClient} from "./discordClient";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export function startRukbunkerEnergyLogger(): void {
    const nextMonth = getNextMonthDate();
    const millisUntilNextMonth = nextMonth.getTime() - new Date().getTime();
    console.log(`Logging rukbunker energy usage in ${millisUntilNextMonth} milliseconds.`);

    if (millisUntilNextMonth > ONE_DAY_MS) {
        // Avoid 32-bit int overflow (which would cause the timeout to execute immediately).
        // See https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
        setTimeout(startRukbunkerEnergyLogger, ONE_DAY_MS);
        return;
    }

    setTimeout(logRukbunkerEnergyUsage, millisUntilNextMonth);
}

async function logRukbunkerEnergyUsage(tryNum: number = 0) {
    try {
        const device = DEVICE_REPOSITORY.findDevice('rb-smart-meter', 'power') as RukbunkerSmartMeterPowerDevice
        const reading = await device.getReading();
        const smartMeterReading = reading.source as DTS353FReading;

        const message = `:robot: It's the first of the month! Here's an overview of the energy usage in the Rukbunker.
> Delivery: ${smartMeterReading.energy.delivery} kWh
> Redelivery: ${smartMeterReading.energy.redelivery} kWh
> Total: ${smartMeterReading.energy.total} kWh`;

        await discordClient.send(message);

        // Start a timeout for the next month (after a day to avoid issues with clock drift)
        setTimeout(startRukbunkerEnergyLogger, ONE_DAY_MS);
    } catch (e) {
        if (tryNum < 5) {
            await discordClient.send(`:robot: Could not read Rukbunker energy usage. Attempting again in 5 minutes. \`${String(e)}\``);
            setTimeout(() => logRukbunkerEnergyUsage(tryNum + 1), 1000 * 60 * 5);
        } else {
            await discordClient.send(`:robot: Could still not read Rukbunker energy usage. Please read it manually at http://10.43.60.245:8082/dts353f/energy`);
        }
    }
}

function getNextMonthDate(): Date {
    const now = new Date();
    if (now.getMonth() == 11) {
        return new Date(now.getFullYear() + 1, 0, 1);
    } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
}
