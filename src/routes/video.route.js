import express from 'express';
const router=express.Router();
import { uploadVideo } from '../controllers/videos/uploadVideo.js';
import { isAuthenticated } from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { notifyUpload } from '../controllers/videos/notifyUpload.js';
import { checkVideoExists } from '../middlewares/checkVideoExists.js';

router.post("/upload",[isAuthenticated,upload.single("video")],uploadVideo);
router.post("/notify-upload",[isAuthenticated,checkVideoExists],notifyUpload);

export default router;