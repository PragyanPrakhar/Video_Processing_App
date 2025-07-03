// src/queue/videoQueue.js
import { Queue } from "bullmq";
import redis from "../utils/redisClient.js";

export const videoQueue = new Queue("video-processing", {
    connection: redis,
});
