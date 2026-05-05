import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addUserMedicine,
  getUserMedicines,
  deleteUserMedicine,
  updateUserMedicine,
  updateMedicineStock,
} from "../controllers/userMedicineController.js";

const router = express.Router();

router.put("/:id/stock", authMiddleware, updateMedicineStock);
router.put("/:id", authMiddleware, updateUserMedicine);
router.post("/", authMiddleware, addUserMedicine);
router.get("/", authMiddleware, getUserMedicines);
router.delete("/:id", authMiddleware, deleteUserMedicine);

export default router;