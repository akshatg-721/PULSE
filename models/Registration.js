const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  enrollment: { type: String, required: true, trim: true, uppercase: true },
  eventName: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { id: false });

registrationSchema.index({ email: 1, event: 1 }, { unique: true });
registrationSchema.index({ enrollment: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
