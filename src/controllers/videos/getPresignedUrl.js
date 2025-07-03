import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2 from "../../utils/r2.js"; // Importing R2 client
export const getPresignedUrl=async(req,res)=>{
    try {
        const key = `videos/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.mp4`;

        const command = new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: key,
            ContentType: "video/mp4",
        });

        const url = await getSignedUrl(r2, command, { expiresIn: 60 * 5 });

        res.json({ uploadUrl: url, key });
    } catch (err) {
        console.error("Error generating upload URL:", err);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
}