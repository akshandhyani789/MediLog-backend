import Fuse from "fuse.js";
import GlobalMedicine from "../models/GlobalMedicine.js";

// 🧠 Extract name from OCR text
export const extractMedicineName = (text) => {
  const lines = text.split("\n");

  const filtered = lines
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  return filtered[0] || "";
};

// 🔍 Fuzzy match
export const matchMedicine = async (name) => {
  const medicines = await GlobalMedicine.find();

  const fuse = new Fuse(medicines, {
    keys: ["name", "brand"],
    threshold: 0.4,
  });

  const result = fuse.search(name);

  return result.length ? result[0].item : null;
};