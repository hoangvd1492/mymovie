import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

function createRedisClient() {
  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error(
      "❌ REDIS_URL is not defined. Please provide Upstash Redis URL.",
    );
  }

  const client = createClient({ url });

  client.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (!globalForRedis.redis) {
  globalForRedis.redis = redis;
}

if (!redis.isOpen) {
  await redis.connect();
}
/**
 * Lấy cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    console.error("Get cache error:", error);
    return null;
  }
}

/**
 * Set cache
 */
export async function setCache(key: string, data: unknown, ttl: number = 3600) {
  try {
    await redis.set(key, JSON.stringify(data), {
      EX: ttl,
    });
  } catch (error) {
    console.error("Set cache error:", error);
  }
}
