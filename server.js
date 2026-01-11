import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import enquiryRoutes from "./routes/enquiryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/enquiry", enquiryRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected via Backend"))
  .catch(err => console.error("❌ Mongo Error:", err));

app.get("/", (req, res) => {
  res.send("Shraddha Scholars Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
