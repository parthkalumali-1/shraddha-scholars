const enquirySchema = new mongoose.Schema(
  {
    name: String,
    class: String,
    school: String,
    phone: String,
    course: String,
    status: {
      type: String,
      default: "new" // new | contacted
    }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
