import multer from "multer";
import path from "node:path";

const storage = multer.memoryStorage();

const upload = multer({
    // dest: path.resolve("__dirname/../public/uploads/images"),
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
});

export default upload;
