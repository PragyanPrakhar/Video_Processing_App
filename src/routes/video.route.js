import express from 'express';
const router=express.Router();
import { uploadVideo } from '../controllers/videos/uploadVideo.js';
import { isAuthenticated } from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

router.post("/upload",[isAuthenticated,upload.single("video")],uploadVideo);

export default router;