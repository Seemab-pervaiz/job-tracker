const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
      default: "Wishlist",
    },
    jobLink: { type: String, trim: true },
    location: { type: String, trim: true },
    salary: { type: String, trim: true },
    appliedDate: { type: Date },
    interviewDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);