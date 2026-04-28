import Tesseract from "tesseract.js";
import { extractMedicineName, matchMedicine } from "../utils/ocrHelper.js";

export const scanAndMatchMedicine = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text;

    console.log("OCR TEXT:", text);

    const name = extractMedicineName(text);

    const medicine = await matchMedicine(name);

    if (medicine) {
      return res.json({ found: true, medicine, text });
    }

    return res.json({ found: false, text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};