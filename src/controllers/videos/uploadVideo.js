import cloudinary from "../../utils/cloudinary.js";
import pool from "../../db.js";
// import videoQueue from "../queue/video.queue.js"; // 🔜 For BullMQ

export const uploadVideo = async (req, res) => {
    const file = req.file;
    const userId = req.user.id;

    if (!file) {
        return res.status(400).json({ error: "No video file provided" });
    }

    try {
        // Wrap stream-based upload in a Promise
        const streamUpload = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "video" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });

        const uploadResult = await streamUpload();

        // Save to DB
        const dbRes = await pool.query(
            `INSERT INTO videos (user_id, video_url, status)
            VALUES ($1, $2, $3) RETURNING *`,
            [userId, uploadResult.secure_url, "pending"]
        );

        const video = dbRes.rows[0];

        // 🔜 Push to BullMQ for background processing
        // await videoQueue.add("process-video", {
        //   videoId: video.id,
        //   videoUrl: video.video_url,
        //   userId,
        // });

        res.status(200).json({
            message: "Video uploaded successfully. Processing started.",
            videoId: video.id,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Video upload failed" });
    }
};
