import {DEVICE_REPOSITORY} from "./device/deviceRepository";
import {discordClient} from "./discordClient";
import {RukbunkerSolarPowerDevice, RukbunkerSolarReading} from "./device/device/power/rukbunkerSolarPowerDevice";

let lastWattHours = 0;

export function startRukbunkerSolarEnergyLogger(): void {
    setTimeout(() => {
        getTotalRBSolarWattHours()
            .then(wattHours => {
                lastWattHours = wattHours;

                const nextMonth = getNextDayDate();
                const millisUntilNextMonth = nextMonth.getTime() - new Date().getTime();
                console.log(`Logging rukbunker solar energy generation in ${millisUntilNextMonth} milliseconds.`);

                setTimeout(logRukbunkerSolarGeneration, millisUntilNextMonth);
            })
    }, 1000 * 60);
}

async function logRukbunkerSolarGeneration(tryNum: number = 0) {
    try {
        const totalWattHours = await getTotalRBSolarWattHours();
        const wattHoursToday = totalWattHours - lastWattHours;
        lastWattHours = totalWattHours;

        const message = `:sunny: Rukbunker generation today: \`${wattHoursToday}\` Wh`;

        await discordClient.send(message);

        startRukbunkerSolarEnergyLogger();
    } catch (e) {
        if (tryNum < 5) {
            setTimeout(() => logRukbunkerSolarGeneration(tryNum + 1), 1000 * 60);
        } else {
            await discordClient.send(`:sunny: Could not read Rukbunker solar generation after ${tryNum} tries.`);
        }
    }
}

function getNextDayDate(): Date {
    const date = new Date();
    date.setHours(24, 0, 0, 0);
    return date;
}

async function getTotalRBSolarWattHours(): Promise<number> {
    const device = DEVICE_REPOSITORY.findDevice('rb-solar', 'power') as RukbunkerSolarPowerDevice;
    const reading = await device.getReading();
    const solarReading = reading.source as RukbunkerSolarReading;
    return solarReading.wattHours;
}
