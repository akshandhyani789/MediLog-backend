import mongoose from "mongoose";
import dotenv from "dotenv";
import GlobalMedicine from "../models/GlobalMedicine.js";

dotenv.config({ path: "./.env" });

const medicines = [
  {
    name: "Paracetamol",
    brand: "Crocin",
    dosage: "500mg",
    barcodes: [{ code: "6009624571518" }],
    uses: ["Fever", "Pain relief"],
  },
  {
    name: "Paracetamol",
    brand: "Calpol",
    dosage: "500mg",
    barcodes: [{ code: "8901234560012" }],
    uses: ["Fever"],
  },
  {
    name: "Paracetamol",
    brand: "Dolo 650",
    dosage: "650mg",
    barcodes: [{ code: "8901234560013" }],
    uses: ["Fever", "Body pain"],
  },
  {
    name: "Ibuprofen",
    brand: "Brufen",
    dosage: "400mg",
    barcodes: [{ code: "8901234560021" }],
    uses: ["Pain", "Inflammation"],
  },
  {
    name: "Amoxicillin",
    brand: "Mox",
    dosage: "500mg",
    barcodes: [{ code: "8901234560031" }],
    uses: ["Bacterial infection"],
  },
  {
    name: "Azithromycin",
    brand: "Azee",
    dosage: "500mg",
    barcodes: [{ code: "8901234560041" }],
    uses: ["Infection"],
  },
  {
    name: "Cetirizine",
    brand: "Cetzine",
    dosage: "10mg",
    barcodes: [{ code: "8901234560051" }],
    uses: ["Allergy"],
  },
  {
    name: "Metformin",
    brand: "Glycomet",
    dosage: "500mg",
    barcodes: [{ code: "8901234560061" }],
    uses: ["Diabetes"],
  },
  {
    name: "Pantoprazole",
    brand: "Pantocid",
    dosage: "40mg",
    barcodes: [{ code: "8901234560071" }],
    uses: ["Acidity"],
  },
  {
    name: "ORS",
    brand: "Electral",
    dosage: "Standard",
    barcodes: [{ code: "8901234560081" }],
    uses: ["Dehydration"],
  },
  {
    name: "Insulin",
    brand: "Lantus",
    dosage: "100IU",
    barcodes: [{ code: "8901234560091" }],
    uses: ["Diabetes"],
  },
  {
    name: "Vitamin D3",
    brand: "Uprise-D3",
    dosage: "60000 IU",
    barcodes: [{ code: "8901234560101" }],
    uses: ["Vitamin deficiency"],
  },
  {
    name: "Multivitamin",
    brand: "Revital H",
    dosage: "Standard",
    barcodes: [{ code: "8901234560111" }],
    uses: ["General health"],
  },
  {
    name: "Paracetamol",
    brand: "Pacimol",
    dosage: "500mg",
    barcodes: [{ code: "8901234560121" }],
  },
  {
    name: "Aspirin",
    brand: "Disprin",
    dosage: "325mg",
    barcodes: [{ code: "8901234560131" }],
  },
  {
    name: "Domperidone",
    brand: "Domstal",
    dosage: "10mg",
    barcodes: [{ code: "8901234560141" }],
  },
  {
    name: "Ranitidine",
    brand: "Rantac",
    dosage: "150mg",
    barcodes: [{ code: "8901234560151" }],
  },
  {
    name: "Levocetirizine",
    brand: "Xyzal",
    dosage: "5mg",
    barcodes: [{ code: "8901234560161" }],
  },
  {
    name: "Amlodipine",
    brand: "Amlong",
    dosage: "5mg",
    barcodes: [{ code: "8901234560171" }],
  },
  {
    name: "Losartan",
    brand: "Losar",
    dosage: "50mg",
    barcodes: [{ code: "8901234560181" }],
  },
  {
    name: "Saumya",
    brand: "Patanjali",
    dosage: "10ml",
    barcodes: [{ code: "8904109449604" }],
    uses: ["Eye care"],
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