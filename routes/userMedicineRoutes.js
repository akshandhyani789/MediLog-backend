import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addUserMedicine,
  getUserMedicines,
  deleteUserMedicine,
} from "../controllers/userMedicineController.js";

const router = express.Router();

router.post("/", authMiddleware, addUserMedicine);
router.get("/", authMiddleware, getUserMedicines);
router.delete("/:id", authMiddleware, deleteUserMedicine);

export default router;