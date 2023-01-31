import {createClient} from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
})

export async function ensureRedisConnected() {
    if (redisClient.isReady) {
        return;
    }

    console.log('Connecting to redis...');
    try{
        await redisClient.disconnect()
    }catch(ignored) { }

    await redisClient.connect();

    console.log('Connected to redis.');
}

export async function redisGet<T>(key: string): Promise<T | undefined> {
    await ensureRedisConnected();

    const value = await redisClient.get(key as any);
    if (value === null || value === undefined) {
        return undefined;
    }

    return JSON.parse(value);
}

export async function redisSet<T>(key: string, value: T): Promise<void> {
    await ensureRedisConnected();

    await redisClient.set(key as any, JSON.stringify(value) as any);
}
