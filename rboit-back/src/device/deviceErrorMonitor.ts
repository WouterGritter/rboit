import {discordClient} from "../discordClient";

const MAX_AGE = 1000 * 60 * 60; // 1 hour

const WARNING_MESSAGE_INTERVAL = 1000 * 60 * 60 * 24; // 1 day

const ERROR_WARNING_THRESHOLD = 100;

const errorEntries: { [deviceName: string]: undefined | ErrorEntry[] } = {};
const lastWarningDates: { [deviceName: string]: undefined | Date } = {};

export function onDeviceError(deviceName: string, error: any): void {
    let entries = errorEntries[deviceName];
    if (entries === undefined) {
        entries = [];
        errorEntries[deviceName] = entries;
    }

    const entry = {
        date: new Date(),
        error: error,
    };
    entries.push(entry);

    cleanUpEntries(entries);
    if (shouldSendWarningMessage(deviceName, entries)) {
        sendWarningMessage(deviceName, entries, entry);
    }
}

function cleanUpEntries(entries: ErrorEntry[]): void {
    const now = new Date();
    for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        const age = now.getTime() - entry.date.getTime();
        if (age > MAX_AGE) {
            entries.splice(i, 1);
        }
    }
}

function shouldSendWarningMessage(deviceName: string, entries: ErrorEntry[]): boolean {
    if (entries.length < ERROR_WARNING_THRESHOLD) {
        // Not enough errors
        return false;
    }

    const lastWarningDate = lastWarningDates[deviceName];
    if (lastWarningDate !== undefined && new Date().getTime() - lastWarningDate.getTime() < WARNING_MESSAGE_INTERVAL) {
        // Not enough time between last warning message
        return false;
    }

    return true;
}

function sendWarningMessage(deviceName: string, entries: ErrorEntry[], lastError: ErrorEntry): void {
    lastWarningDates[deviceName] = new Date();

    let message = `:warning: High error count for device **${deviceName}**! Received ${entries.length} errors in the last hour. \`${String(lastError.error)}\``;

    if (lastError.error.stack !== undefined) {
        message += '\n```\n' + lastError.error.stack + '\n```';
    }

    (async () => {
        await discordClient.send(message);
    })();
}

declare type ErrorEntry = {
    date: Date,
    error: any,
};
