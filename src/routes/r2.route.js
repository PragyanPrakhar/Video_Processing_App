import express from "express";

import { getPresignedUrl } from "../controllers/videos/getPresignedUrl.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.get("/upload-url", isAuthenticated,getPresignedUrl);

export default router;
