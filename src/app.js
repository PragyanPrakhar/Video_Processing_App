// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"; // Importing auth routes
import cors from "cors"; // Importing CORS middleware
import videoRoutes from "./routes/video.route.js"; // Importing video routes
import r2Routes from "./routes/r2.route.js"; // Importing R2 routes

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true, // to allow cookies
    })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Routes will be added here like:
app.use("/api/auth", authRoutes); // Using auth routes
app.use("/api/videos",videoRoutes); // Using video routes
app.use("/api/r2", r2Routes); // Using R2 routes

// import videoRoutes from "./routes/video.route.js";
// app.use("/api/videos", videoRoutes);

export default app;
