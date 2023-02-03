export async function sleep(delay: number | undefined): Promise<void> {
    if (delay === undefined || delay <= 0) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}
