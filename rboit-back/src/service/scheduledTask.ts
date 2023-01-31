export function scheduleTask(runnable: () => any, dateSupplier: 'next-midnight' | 'next-month' | ((now?: Date) => Date), repeat: boolean) {
    if (dateSupplier === 'next-midnight') {
        dateSupplier = NEXT_MIDNIGHT_SUPPLIER;
    } else if (dateSupplier === 'next-month') {
        dateSupplier = NEXT_MONTH_SUPPLIER;
    }

    const now = new Date();
    const nextRun = dateSupplier(now);

    let msUntilNextRun = nextRun.getTime() - now.getTime();
    if (msUntilNextRun < 0) {
        msUntilNextRun = 0;
    }

    if (msUntilNextRun > 2_000_000_000) {
        // Prevent 32-bit signed int overflow, schedule task again after a while.
        setTimeout(
            () => scheduleTask(runnable, () => nextRun, repeat),
            2_000_000_000
        );

        return;
    }

    setTimeout(
        () => {
            try {
                runnable();
            } catch (e) {
                console.error('Error while running scheduled task.');
                console.error(e);
            }

            if (repeat) {
                scheduleTask(runnable, dateSupplier, repeat);
            }
        },
        msUntilNextRun
    );
}

const NEXT_MIDNIGHT_SUPPLIER = (now: Date) => {
    const date = new Date(now);
    date.setHours(24, 0, 0, 0);
    return date;
};

const NEXT_MONTH_SUPPLIER = (now: Date) => {
    if (now.getMonth() == 11) {
        return new Date(now.getFullYear() + 1, 0, 1);
    } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
};

export function withDelay(delay: number, units: TimeUnit = 'milliseconds'): ((now: Date) => Date) {
    delay = convertToMilliseconds(delay, units);

    return (now: Date) => {
        return new Date(now.getTime() + delay);
    };
}

export declare type TimeUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export function convertToMilliseconds(value: number, units: TimeUnit): number {
    switch (units) {
        case 'milliseconds':
            return value;
        case 'seconds':
            return value * 1000;
        case 'minutes':
            return value * 1000 * 60;
        case 'hours':
            return value * 1000 * 60 * 60;
        case 'days':
            return value * 1000 * 60 * 60 * 24;
        case 'weeks':
            return value * 1000 * 60 * 60 * 24 * 7;
        case 'months':
            return value * 1000 * 60 * 60 * 24 * 30;
        case 'years':
            return value * 1000 * 60 * 60 * 24 * 365;
        default:
            throw new Error(`Invalid unit '${units}'`);
    }
}
