const express = require("express");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
const eventFields = ["title", "category", "date", "time", "venue", "club", "description"];

router.use(requireAdmin);

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function eventInput(body, existing) {
  const input = {};
  for (const field of eventFields) {
    if (body[field] !== undefined || !existing) {
      input[field] = String(body[field] || "").trim();
    } else {
      input[field] = existing[field];
    }
  }

  if (!input.title || !input.category || !input.time || !input.venue || !input.club) {
    return { error: "Complete all required event fields." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)
      || Number.isNaN(Date.parse(`${input.date}T00:00:00Z`))) {
    return { error: "Enter a valid event date.", field: "date" };
  }
  return { input };
}

router.get("/events", async (request, response, next) => {
  try {
    const events = await Event.find().sort({ date: 1, id: 1 }).lean();
    return response.json(events.map((event) => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      club: event.club,
      description: event.description || "",
      isActive: event.isActive !== false
    })));
  } catch (error) {
    return next(error);
  }
});

router.post("/events", async (request, response, next) => {
  const body = request.body || {};
  const { input, error, field } = eventInput(body);
  if (error) return response.status(400).json({ message: error, field });
  const slug = slugify(body.slug || input.title);
  if (!slug) return response.status(400).json({ message: "Enter a valid event title." });

  try {
    const latest = await Event.findOne().sort({ id: -1 }).select("id").lean();
    const event = await Event.create({
      ...input,
      id: latest ? latest.id + 1 : 1,
      slug,
      isActive: true
    });
    return response.status(201).json({ message: "Event created.", event });
  } catch (err) {
    if (err.code === 11000) {
      return response.status(409).json({ message: "An event with this slug already exists." });
    }
    return next(err);
  }
});

router.put("/events/:slug", async (request, response, next) => {
  try {
    const event = await Event.findOne({ slug: request.params.slug });
    if (!event) return response.status(404).json({ message: "Event not found." });

    const { input, error, field } = eventInput(request.body || {}, event);
    if (error) return response.status(400).json({ message: error, field });
    Object.assign(event, input);
    await event.save();
    return response.json({ message: "Event updated.", event });
  } catch (error) {
    return next(error);
  }
});

router.delete("/events/:slug", async (request, response, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { slug: request.params.slug },
      { $set: { isActive: false } },
      { new: true }
    );
    if (!event) return response.status(404).json({ message: "Event not found." });
    return response.json({ message: "Event archived. Existing registrations and attendance are preserved." });
  } catch (error) {
    return next(error);
  }
});

router.patch("/events/:slug/restore", async (request, response, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { slug: request.params.slug },
      { $set: { isActive: true } },
      { new: true }
    );
    if (!event) return response.status(404).json({ message: "Event not found." });
    return response.json({ message: "Event restored." });
  } catch (error) {
    return next(error);
  }
});

router.get("/attendance", async (request, response, next) => {
  try {
    const eventFilter = {};
    if (request.query.event) {
      const event = await Event.findOne({ slug: String(request.query.event) }).select("_id");
      if (!event) return response.status(404).json({ message: "Event not found." });
      eventFilter._id = event._id;
    }
    if (request.query.club) {
      eventFilter.club = String(request.query.club).trim();
    }

    const events = await Event.find(eventFilter).select("_id");
    const attendance = await Attendance.find({
      event: { $in: events.map((event) => event._id) }
    }).sort({ attendedAt: -1 }).lean();
    return response.json(attendance.map(({ _id, __v, ...record }) => record));
  } catch (error) {
    return next(error);
  }
});

router.post("/attendance", async (request, response, next) => {
  const body = request.body || {};
  const eventSlug = String(body.eventSlug || "").trim();
  const enrollment = String(body.enrollment || "").trim().toUpperCase();
  if (!eventSlug || !enrollment) {
    return response.status(400).json({
      message: "Choose an event and enter an enrollment number."
    });
  }

  try {
    const event = await Event.findOne({ slug: eventSlug });
    if (!event) return response.status(404).json({ message: "Event not found." });

    const registration = await Registration.findOne({ event: event._id, enrollment });
    if (!registration) {
      return response.status(404).json({
        message: "No registration was found for this enrollment number and event."
      });
    }

    const attendance = await Attendance.create({
      event: event._id,
      eventName: event.title,
      club: event.club,
      registration: registration._id,
      user: registration.user,
      name: registration.name,
      email: registration.email,
      enrollment: registration.enrollment,
      markedBy: request.session.user.id
    });
    return response.status(201).json({
      message: "Attendance marked.",
      attendance
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ message: "Attendance is already marked for this event." });
    }
    return next(error);
  }
});

module.exports = router;
