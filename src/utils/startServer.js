// src/utils/startServer.js
import pool from "../db.js";
import app from "../app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const client = await pool.connect();
        console.log("✅ PostgreSQL connected");
        client.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ DB connection failed:", err);
        process.exit(1);
    }
};

export default startServer;
