import express from "express";
import pool from "../../db.js"; // Assuming you have a db.js file for database connection


export const notifyUpload = async (req, res) => {
    const { key } = req.body;
    const userId = req.user.id;

    const safeKey = key?.trim();
    if (!safeKey || !safeKey.startsWith("videos/")) {
        return res.status(400).json({ error: "Invalid or missing video key" });
    }

    try {
        // Optional: check for duplicates
        const existing = await pool.query(
            "SELECT id FROM videos WHERE video_key = $1",
            [safeKey]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Video already exists" });
        }

        const dbRes = await pool.query(
            `INSERT INTO videos (user_id, video_key, status)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, video_key, status, created_at`,
            [userId, safeKey, "pending"]
        );

        const video = dbRes.rows[0];

        // 🔜 Queue for background processing
        // await videoQueue.add("process-video", {
        //   videoId: video.id,
        //   videoKey: video.video_key,
        //   userId,
        // });

        return res.status(201).json({
            message: "Video upload notification received. Processing started.",
            video,
        });
    } catch (error) {
        console.error("❌ notifyUpload Error:", error);
        return res.status(500).json({ error: "Failed to notify upload" });
    }
};
