const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { id: false });

module.exports = mongoose.model("Contact", contactSchema);
