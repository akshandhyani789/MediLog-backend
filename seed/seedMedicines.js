import mongoose from "mongoose";
import dotenv from "dotenv";
import GlobalMedicine from "../models/GlobalMedicine.js";

dotenv.config({ path: "./.env" });

const medicines = [
  // 🔥 PARACETAMOL (3 brands)
  {
    name: "Paracetamol",
    brand: "Crocin",
    dosage: "500mg",
    type: "Tablet",
    barcode: "6009624571518",
  },
  {
    name: "Paracetamol",
    brand: "Calpol",
    dosage: "500mg",
    type: "Tablet",
    barcode: "8901234560012",
  },
  {
    name: "Paracetamol",
    brand: "Dolo 650",
    dosage: "650mg",
    type: "Tablet",
    barcode: "8901234560013",
  },

  // 🔥 IBUPROFEN
  {
    name: "Ibuprofen",
    brand: "Brufen",
    dosage: "400mg",
    type: "Tablet",
    barcode: "8901234560021",
  },

  // 🔥 AMOXICILLIN
  {
    name: "Amoxicillin",
    brand: "Mox",
    dosage: "500mg",
    type: "Capsule",
    barcode: "8901234560031",
  },

  // 🔥 AZITHROMYCIN
  {
    name: "Azithromycin",
    brand: "Azee",
    dosage: "500mg",
    type: "Tablet",
    barcode: "8901234560041",
  },

  // 🔥 CETIRIZINE
  {
    name: "Cetirizine",
    brand: "Cetzine",
    dosage: "10mg",
    type: "Tablet",
    barcode: "8901234560051",
  },

  // 🔥 METFORMIN
  {
    name: "Metformin",
    brand: "Glycomet",
    dosage: "500mg",
    type: "Tablet",
    barcode: "8901234560061",
  },

  // 🔥 PANTOPRAZOLE
  {
    name: "Pantoprazole",
    brand: "Pantocid",
    dosage: "40mg",
    type: "Tablet",
    barcode: "8901234560071",
  },

  // 🔥 ORS
  {
    name: "ORS",
    brand: "Electral",
    dosage: "Standard",
    type: "Sachet",
    barcode: "8901234560081",
  },

  // 🔥 INSULIN
  {
    name: "Insulin",
    brand: "Lantus",
    dosage: "100IU",
    type: "Injection",
    barcode: "8901234560091",
  },

  // 🔥 VITAMIN D
  {
    name: "Vitamin D3",
    brand: "Uprise-D3",
    dosage: "60000 IU",
    type: "Capsule",
    barcode: "8901234560101",
  },

  // 🔥 MULTIVITAMIN
  {
    name: "Multivitamin",
    brand: "Revital H",
    dosage: "Standard",
    type: "Capsule",
    barcode: "8901234560111",
  },

  // 🔥 DUPLICATE TEST
  {
    name: "Paracetamol",
    brand: "Pacimol",
    dosage: "500mg",
    type: "Tablet",
    barcode: "8901234560121",
  },

  // 🔥 ASPIRIN
  {
    name: "Aspirin",
    brand: "Disprin",
    dosage: "325mg",
    type: "Tablet",
    barcode: "8901234560131",
  },

  // 🔥 DOMPERIDONE
  {
    name: "Domperidone",
    brand: "Domstal",
    dosage: "10mg",
    type: "Tablet",
    barcode: "8901234560141",
  },

  // 🔥 RANITIDINE
  {
    name: "Ranitidine",
    brand: "Rantac",
    dosage: "150mg",
    type: "Tablet",
    barcode: "8901234560151",
  },

  // 🔥 LEVOCETIRIZINE
  {
    name: "Levocetirizine",
    brand: "Xyzal",
    dosage: "5mg",
    type: "Tablet",
    barcode: "8901234560161",
  },

  // 🔥 AMLODIPINE
  {
    name: "Amlodipine",
    brand: "Amlong",
    dosage: "5mg",
    type: "Tablet",
    barcode: "8901234560171",
  },

  // 🔥 LOSARTAN
  {
    name: "Losartan",
    brand: "Losar",
    dosage: "50mg",
    type: "Tablet",
    barcode: "8901234560181",
  },

  // 🔥 CUSTOM ENTRY
  {
    name: "Saumya",
    brand: "Patanjali",
    dosage: "10ml",
    type: "Eye Drops",
    barcode: "8904109449604",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("URI:", process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await GlobalMedicine.deleteMany(); // optional (clears old data)

    await GlobalMedicine.insertMany(medicines);

    console.log("🚀 Medicines Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();