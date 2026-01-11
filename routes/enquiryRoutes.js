import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

// POST – public (students)
router.post("/", async (req, res) => {
    console.log("POST BODY:", req.body);
    
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    return res.json({
      message: "Enquiry submitted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

// GET – admin only
router.get("/", async (req, res) => {
  const adminPass = req.headers["x-admin-password"];

  // DEBUG (temporary)
  console.log("HEADER:", req.headers["x-admin-password"]);
console.log("ENV:", process.env.ADMIN_PASSWORD);


  if (adminPass !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  return res.json(enquiries);
});

export default router;
