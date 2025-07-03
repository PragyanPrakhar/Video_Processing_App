import { Worker } from "bullmq";
import redis from "../utils/redisClient.js";

const videoWorker = new Worker(
    "video-processing",
    async (job) => {
        console.log("Woroker started for job:", job.id);
        const { videoId, videoKey, userId } = job.data;

        console.log(`Processing video ID: ${videoId} for user ${userId}`);

        // Example: Compress or generate thumbnail here

        // Then update DB status to "processed"
        // await pool.query("UPDATE videos SET status='processed' WHERE id=$1", [videoId]);
    },
    {
        connection: redis,
    }
);

videoWorker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
});

videoWorker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job.id}`, err);
});
