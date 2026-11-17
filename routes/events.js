const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    const events = await Event.find({ isActive: { $ne: false } }).sort({ date: 1, id: 1 }).lean();
    return response.json(events.map((event) => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      club: event.club,
      description: event.description || ""
    })));
  } catch (error) {
    return next(error);
  }
});

router.get("/:slug", async (request, response, next) => {
  try {
    const event = await Event.findOne({
      slug: request.params.slug,
      isActive: { $ne: false }
    }).lean();
    if (!event) return response.status(404).json({ message: "Event not found." });
    return response.json({
      id: event.id,
      slug: event.slug,
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      club: event.club,
      description: event.description || ""
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
