import express from "express";
import multer from "multer";
import { scanAndMatchMedicine } from "../controllers/ocrController.js";

const router = express.Router();

// 📂 store images
const upload = multer({ dest: "uploads/" });

router.post("/scan", upload.single("image"), scanAndMatchMedicine);

export default router;