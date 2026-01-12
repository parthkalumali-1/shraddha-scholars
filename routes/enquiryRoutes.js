import express from "express";
import Enquiry from "../models/Enquiry.js";

export default function enquiryRoutes(transporter) {
  const router = express.Router();

  // ============================
  // POST – public (students)
  // ============================
  router.post("/", async (req, res) => {
    console.log("📩 New enquiry:", req.body);

    try {
      // Save enquiry to DB
      const enquiry = new Enquiry(req.body);
      const savedEnquiry = await enquiry.save();

      // Send email (NON-BLOCKING)
      try {
        await transporter.sendMail({
          from: `"Shraddha Scholars" <${process.env.EMAIL_USER}>`,
          to: "1107shraddha@gmail.com",
          subject: "📩 New Student Enquiry – Shraddha Scholars",
          html: `
            <h2>New Enquiry Received</h2>
            <p><strong>Name:</strong> ${savedEnquiry.name}</p>
            <p><strong>Class:</strong> ${savedEnquiry.class}</p>
            <p><strong>School:</strong> ${savedEnquiry.school || "-"}</p>
            <p><strong>Phone:</strong> ${savedEnquiry.phone}</p>
            <p><strong>Course:</strong> ${savedEnquiry.course || "-"}</p>
            <p><strong>Date:</strong> ${new Date(savedEnquiry.createdAt).toLocaleString()}</p>
          `,
        });

        console.log("✅ Email notification sent");
      } catch (mailErr) {
        console.log("⚠️ Email failed but enquiry saved:", mailErr.message);
      }

      return res.json({
        message: "Enquiry submitted successfully",
      });
    } catch (err) {
      console.error("❌ Enquiry save error:", err.message);
      return res.status(500).json({
        error: "Failed to submit enquiry",
      });
    }
  });

  // ============================
  // GET – admin only
  // ============================
  router.get("/", async (req, res) => {
    const adminPass = req.headers["x-admin-password"];

    // DEBUG (remove later if you want)
    console.log("HEADER PASS:", adminPass);
    console.log("ENV PASS:", process.env.ADMIN_PASSWORD);

    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const enquiries = await Enquiry.find().sort({ createdAt: -1 });
      return res.json(enquiries);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}
