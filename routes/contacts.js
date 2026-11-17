const crypto = require("crypto");
const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subjects = ["Events", "Clubs", "Technical issue", "Other"];

function newContactId() {
  return `MSG-${String(crypto.randomInt(10000, 100000))}`;
}

router.post("/", async (request, response, next) => {
  const body = request.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  const bad = (text, field) => response.status(400).json({ message: text, field });

  if (name.length < 2) return bad("Name must be at least 2 characters.", "name");
  if (!emailPattern.test(email)) return bad("Enter a valid email address.", "email");
  if (!subjects.includes(subject)) return bad("Please choose a valid subject.", "subject");
  if (message.length < 10 || message.length > 500) {
    return bad("Message must be between 10 and 500 characters.", "message");
  }

  try {
    const contact = await Contact.create({
      id: newContactId(),
      name,
      email,
      subject,
      message
    });
    return response.status(200).json({ message: "Message sent.", id: contact.id });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
