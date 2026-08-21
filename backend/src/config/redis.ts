import { createClient } from "redis";
import "dotenv/config";

const client = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",

    socket: {
        reconnectStrategy: (retries) => {
            if (retries >= 10) {
                return false;
            }

            const delay = Math.min(100 * 2 ** retries, 3000);
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

export default client;