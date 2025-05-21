import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

const MAX_REQUESTS = 5; // per second

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    // Use userId from JWT payload
    const userId = (req as any).user?.userId;
    if (!userId)  res.status(401).json({ error: "Unauthorized" });

    const key = `ratelimit:${userId}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, 1); // 1-second window
    }

    if (current > MAX_REQUESTS) {
       res.status(429).json({ error: "Too many requests" });
    }

    next();
  } catch (err) {
    console.error("Rate limit error", err);
     res.status(500).json({ error: "Internal server error" });
  }
};
