const crypto = require("crypto");
const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function newRegistrationId() {
  return `PULSE-${String(crypto.randomInt(10000, 100000))}`;
}

router.post("/", requireAuth, async (request, response, next) => {
  const body = request.body || {};
  const name = String(request.session.user.name || "").trim();
  const email = String(request.session.user.email || "").trim().toLowerCase();
  const enrollment = String(request.session.user.enrollment || "").trim().toUpperCase();
  const phone = String(body.phone || "").trim();
  const course = String(body.course || "").trim();
  const year = String(body.year || "").trim();
  const eventName = String(body.eventName || "").trim();
  const agree = String(body.agree || "").trim();
  const bad = (message, field) => response.status(400).json({ message, field });

  if (name.length < 2 || !enrollment) {
    return response.status(400).json({
      message: "Complete your name and enrollment number in your account profile."
    });
  }
  if (!/^\d{10}$/.test(phone)) return bad("Phone must be exactly 10 digits.", "phone");
  if (!course) return bad("Course is required.", "course");
  if (!["1", "2", "3", "4"].includes(year)) {
    return bad("Year must be 1, 2, 3, or 4.", "year");
  }
  if (agree !== "on" && agree !== "true") {
    return bad("You must agree to the terms.", "agree");
  }

  try {
    const event = await Event.findOne({ title: eventName, isActive: { $ne: false } });
    if (!event) return bad("Choose a valid event from the list.", "eventName");

    const duplicate = await Registration.exists({ email, event: event._id });
    if (duplicate) {
      return response.status(409).json({
        message: `You are already registered for "${eventName}".`
      });
    }

    const registration = new Registration({
      id: newRegistrationId(),
      user: request.session.user.id,
      event: event._id,
      name,
      email,
      phone,
      course,
      year,
      enrollment,
      eventName: event.title
    });
    await registration.save();

    return response.status(200).json({
      message: "Registration successful.",
      id: registration.id,
      eventName: registration.eventName,
      name: registration.name
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern
        && (error.keyPattern.email || error.keyPattern.enrollment)) {
      return response.status(409).json({
        message: `You are already registered for "${eventName}".`
      });
    }
    return next(error);
  }
});

module.exports = router;
