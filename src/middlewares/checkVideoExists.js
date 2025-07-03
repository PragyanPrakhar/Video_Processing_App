// src/middlewares/checkVideoExists.js
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import r2 from "../utils/r2.js"; // Your configured s3 client

export const checkVideoExists = async (req, res, next) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ error: "No video key provided" });
    }

    try {
        await r2.send(
            new HeadObjectCommand({
                Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
                Key: key,
            })
        );

        // File exists, proceed to controller
        next();
    } catch (err) {
        if (
            err.$metadata?.httpStatusCode === 404 ||
            err.Code === "NotFound" ||
            err.name === "NotFound"
        ) {
            return res
                .status(404)
                .json({ error: "Video file not found in R2" });
        }
        console.error("R2 check error:", err);
        return res
            .status(500)
            .json({ error: "Error checking video existence" });
    }
};
