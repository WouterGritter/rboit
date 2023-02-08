import {createClient} from "redis";

const enableRedis = process.env.REDIS_URL ?? '' !== '';
if (!enableRedis) {
    console.log('Redis functionality disabled.');
}

const redisClient = enableRedis ? createClient({url: process.env.REDIS_URL}) : undefined;

export async function ensureRedisConnected() {
    if (!enableRedis) {
        return;
    }

    try{
        await redisClient.connect();
        console.log('Connected to redis.');
    }catch(ignored) { }
}

export async function redisGet<T>(key: string): Promise<T | undefined> {
    if (!enableRedis) {
        return undefined;
    }

    await ensureRedisConnected();

    const value = await redisClient.get(key as any);
    if (value === null || value === undefined) {
        return undefined;
    }

    return JSON.parse(value);
}

export async function redisSet<T>(key: string, value: T): Promise<void> {
    if (!enableRedis) {
        return;
    }

    await ensureRedisConnected();

    await redisClient.set(key as any, JSON.stringify(value) as any);
}
