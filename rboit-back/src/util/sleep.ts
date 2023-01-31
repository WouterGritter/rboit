export async function sleep(delay: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}
