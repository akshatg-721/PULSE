const fs = require("fs");
const path = require("path");
const connectDatabase = require("../config/database");
const Contact = require("../models/Contact");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");

const dataDirectory = path.join(__dirname, "..", "data");

function readArray(filename) {
  const filePath = path.join(dataDirectory, filename);
  if (!fs.existsSync(filePath)) return [];

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(data)) {
    throw new Error(`${filename} must contain a JSON array.`);
  }
  return data;
}

async function migrate() {
  await connectDatabase();
  await Promise.all([Contact.init(), Event.init(), Registration.init(), User.init()]);

  const events = readArray("events.json");
  const users = readArray("users.json");
  const registrations = readArray("registrations.json");
  const contacts = readArray("contacts.json");
  const eventsByTitle = new Map();

  for (const event of events) {
    const savedEvent = await Event.findOneAndUpdate(
      { slug: event.slug },
      { $set: { ...event, isActive: event.isActive !== false } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    eventsByTitle.set(savedEvent.title, savedEvent);
  }
  await Event.collection.updateMany(
    { capacity: { $exists: true } },
    { $unset: { capacity: "" } }
  );

  const profilesByEmail = new Map();
  for (const registration of registrations) {
    const email = String(registration.email || "").trim().toLowerCase();
    if (email && !profilesByEmail.has(email)) {
      profilesByEmail.set(email, registration);
    }
  }

  for (const user of users) {
    const email = String(user.email).trim().toLowerCase();
    const profile = profilesByEmail.get(email) || {};
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: user.name || profile.name || email.split("@")[0],
          email,
          enrollment: user.enrollment || profile.enrollment,
          role: user.role || "student",
          salt: user.salt,
          passwordHash: user.passwordHash || user.password,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
        }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  for (const registration of registrations) {
    const event = eventsByTitle.get(registration.eventName)
      || await Event.findOne({ title: registration.eventName });
    if (!event) {
      throw new Error(`Could not find event "${registration.eventName}" for registration ${registration.id}.`);
    }

    const user = await User.findOne({ email: String(registration.email).toLowerCase() }).select("_id");
    await Registration.findOneAndUpdate(
      { id: registration.id },
      {
        $set: {
          ...registration,
          email: String(registration.email).trim().toLowerCase(),
          enrollment: String(registration.enrollment || "").trim().toUpperCase(),
          event: event._id,
          user: user ? user._id : undefined,
          createdAt: registration.createdAt ? new Date(registration.createdAt) : new Date()
        }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  for (const contact of contacts) {
    await Contact.findOneAndUpdate(
      { id: contact.id },
      {
        $set: {
          ...contact,
          email: String(contact.email).trim().toLowerCase(),
          createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date()
        }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  console.log(
    `Migration complete: ${events.length} events, ${users.length} users, `
    + `${registrations.length} registrations, ${contacts.length} contacts.`
  );
}

migrate()
  .catch((error) => {
    console.error("JSON-to-MongoDB migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  });
