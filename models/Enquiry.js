import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  school: String,
  phone: { type: String, required: true },
  course: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Enquiry", enquirySchema);
