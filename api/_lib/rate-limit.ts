import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Result = { allowed: true } | { allowed: false; message?: string };

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

const minuteLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "pb:rl:min",
      analytics: false,
    })
  : null;

const dayLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
      prefix: "pb:rl:day",
      analytics: false,
    })
  : null;

export const checkRateLimit = async (ip: string): Promise<Result> => {
  if (!minuteLimiter || !dayLimiter) {
    return { allowed: true };
  }
  try {
    const minute = await minuteLimiter.limit(ip);
    if (!minute.success) {
      return {
        allowed: false,
        message: "분당 호출 한도(5회)를 초과했습니다. 1분 후 다시 시도해주세요.",
      };
    }
    const day = await dayLimiter.limit(ip);
    if (!day.success) {
      return {
        allowed: false,
        message: "일일 호출 한도(50회)를 초과했습니다. 내일 다시 시도해주세요.",
      };
    }
    return { allowed: true };
  } catch (e) {
    console.warn("[rate-limit] redis error, allowing request:", e);
    return { allowed: true };
  }
};
