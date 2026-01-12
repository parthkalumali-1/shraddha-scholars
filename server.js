import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import enquiryRoutes from "./routes/enquiryRoutes.js";

// ================== APP INIT ==================
const app = express();

// ================== CORS ==================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-admin-password"],
  })
);

// ================== BODY PARSERS ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== MAIL TRANSPORTER ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify mail server (shows in Render logs)
transporter.verify((err) => {
  if (err) {
    console.log("❌ Mail server error:", err.message);
  } else {
    console.log("✅ Mail server ready");
  }
});

// ================== ROUTES ==================
app.use("/api/enquiry", enquiryRoutes(transporter));

// ================== MONGODB ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err.message));

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
