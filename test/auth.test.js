const assert = require("node:assert/strict");
const test = require("node:test");
const { requireAdmin, requireAuth } = require("../middleware/auth");
const { createPasswordHash, passwordMatches } = require("../utils/passwords");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

function runGuard(guard, request) {
  const result = {};
  const response = {
    status(code) {
      result.status = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
    redirect(location) {
      result.redirect = location;
      return this;
    }
  };
  guard(request, response, () => {
    result.nextCalled = true;
  });
  return result;
}

test("event registration rejects a signed-out request", () => {
  const result = runGuard(requireAuth, {
    session: null,
    method: "POST",
    originalUrl: "/register"
  });

  assert.equal(result.status, 401);
  assert.equal(result.nextCalled, undefined);
});

test("admin routes reject signed-out users and students", () => {
  assert.equal(runGuard(requireAdmin, {
    session: null,
    method: "GET",
    originalUrl: "/api/admin/events"
  }).status, 401);

  assert.equal(runGuard(requireAdmin, {
    session: { user: { role: "student" } },
    method: "GET",
    originalUrl: "/api/admin/events"
  }).status, 403);
});

test("admin role passes the admin route guard", () => {
  const result = runGuard(requireAdmin, {
    session: { user: { role: "admin" } },
    method: "GET",
    originalUrl: "/api/admin/events"
  });

  assert.equal(result.nextCalled, true);
});

test("password hashes verify only the matching password", () => {
  const hash = createPasswordHash("test-password");
  assert.equal(passwordMatches("test-password", hash.salt, hash.passwordHash), true);
  assert.equal(passwordMatches("incorrect-password", hash.salt, hash.passwordHash), false);
});

test("registrations and attendance prevent duplicate event enrollment records", () => {
  assert(Registration.schema.indexes().some(([keys, options]) => (
    keys.event === 1 && keys.enrollment === 1 && options.unique
  )));
  assert(Attendance.schema.indexes().some(([keys, options]) => (
    keys.event === 1 && keys.enrollment === 1 && options.unique
  )));
});

test("event schema omits capacity and allows an empty description", async () => {
  const event = new Event({
    id: 1,
    slug: "test-event",
    title: "Test event",
    category: "Tech",
    date: "2026-11-17",
    time: "5:00 PM",
    venue: "Lab",
    club: "Tech Club"
  });

  await event.validate();
  assert.equal(Event.schema.path("capacity"), undefined);
  assert.equal(event.description, "");
});
