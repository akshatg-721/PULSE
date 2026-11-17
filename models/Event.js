const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true, trim: true },
  club: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  isActive: { type: Boolean, default: true }
}, { id: false });

module.exports = mongoose.model("Event", eventSchema);
