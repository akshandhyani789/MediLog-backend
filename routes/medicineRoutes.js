import express from "express";
import { getMedicineByBarcode } from "../controllers/medicineController.js";

const router = express.Router();

router.get("/:barcode", getMedicineByBarcode);

export default router;