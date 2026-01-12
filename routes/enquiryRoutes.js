import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

/* ---------------- POST (students) ---------------- */
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    res.json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GET (admin) ---------------- */
router.get("/", async (req, res) => {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

/* ---------------- UPDATE status ---------------- */
router.put("/:id/status", async (req, res) => {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await Enquiry.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });

  res.json({ message: "Status updated" });
});

/* ---------------- DELETE enquiry ---------------- */
router.delete("/:id", async (req, res) => {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
