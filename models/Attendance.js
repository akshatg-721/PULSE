const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  eventName: { type: String, required: true, trim: true },
  club: { type: String, required: true, trim: true },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  enrollment: { type: String, required: true, trim: true, uppercase: true },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  attendedAt: { type: Date, default: Date.now }
});

attendanceSchema.index({ event: 1, enrollment: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
