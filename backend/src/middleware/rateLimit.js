import rateLimiter from "../config/upstash.js";

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip;
    
    const { success } = await rateLimiter.limit(ip);
    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.error("Error in rate limiter middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default rateLimiterMiddleware;
