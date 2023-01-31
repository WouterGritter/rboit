import {DEVICE_REPOSITORY} from "./device/deviceRepository";
import {discordClient} from "./discordClient";
import {RukbunkerSolarPowerDevice, RukbunkerSolarReading} from "./device/device/power/rukbunkerSolarPowerDevice";
import {redisGet, redisSet} from "./redisClient";
import {sleep} from "./util/sleep";

export async function startRukbunkerSolarEnergyLogger(): Promise<void> {
    if (await getLastWattHours() === undefined) {
        await sleep(30 * 1000); // Wait for device to be ready...

        console.log('Last rukbunker total solar energy generation was not present in redis. Loading value from device...');
        const totalWattHours = await getTotalRBSolarWattHours();
        await setLastWattHours(totalWattHours);
    }

    const nextMonth = getNextDayDate();
    const millisUntilNextMonth = nextMonth.getTime() - new Date().getTime();
    console.log(`Logging rukbunker solar energy generation in ${millisUntilNextMonth} milliseconds.`);

    setTimeout(logRukbunkerSolarGeneration, millisUntilNextMonth);
}

async function logRukbunkerSolarGeneration(tryNum: number = 0) {
    try {
        const totalWattHours = await getTotalRBSolarWattHours();
        const wattHoursToday = totalWattHours - await getLastWattHours();

        const message = `:sunny: Rukbunker generation today: \`${wattHoursToday}\` Wh`;
        await discordClient.send(message);

        await setLastWattHours(totalWattHours);
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

async function getLastWattHours(): Promise<number | undefined> {
    const value = await redisGet<number>('rb-solar-last-watt-hours');
    console.log(`Loaded last rukbunker total solar energy generation from redis: ${value / 1000} kWh`);
    return value;
}

async function setLastWattHours(value: number): Promise<void> {
    await redisSet<number>('rb-solar-last-watt-hours', value);
    console.log(`Stored last rukbunker total solar energy generation to redis: ${value / 1000} kWh`);
}
