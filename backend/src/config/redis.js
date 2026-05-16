import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

const client = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis reconnect failed after max retries");
        return new Error("Retry attempts exhausted");
      }

      // Exponential backoff: min(2^retries * 100ms, 3000ms)
      const delay = Math.min(2 ** retries * 100, 3000);
      return delay;
    },
  },
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err) => {
  console.error("Redis client error", err);
});

await client.connect();

export default client;