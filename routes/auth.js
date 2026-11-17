const express = require("express");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { createPasswordHash, passwordMatches } = require("../utils/passwords");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sessionUser(user) {
  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email,
    enrollment: user.enrollment || "",
    role: user.role || "student"
  };
}

function regenerateSession(request) {
  return new Promise((resolve, reject) => {
    request.session.regenerate((error) => error ? reject(error) : resolve());
  });
}

function saveSession(request) {
  return new Promise((resolve, reject) => {
    request.session.save((error) => error ? reject(error) : resolve());
  });
}

router.post("/signup", async (request, response, next) => {
  const body = request.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const enrollment = String(body.enrollment || "").trim().toUpperCase();
  const password = body.password;

  if (name.length < 2) {
    return response.status(400).json({ message: "Name must be at least 2 characters." });
  }
  if (!emailPattern.test(email)) {
    return response.status(400).json({ message: "Enter a valid email address." });
  }
  if (!enrollment || enrollment.length > 50) {
    return response.status(400).json({ message: "Enter a valid enrollment number." });
  }
  if (typeof password !== "string" || password.length < 6) {
    return response.status(400).json({
      message: "Password must be at least 6 characters."
    });
  }

  try {
    const user = new User({
      name,
      email,
      enrollment,
      role: "student",
      ...createPasswordHash(password)
    });
    await user.save();
    return response.status(201).json({
      message: "Account created. You can sign in here later."
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        message: "An account with this email already exists."
      });
    }
    return next(error);
  }
});

router.post("/signin", async (request, response, next) => {
  const body = request.body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const password = body.password;

  if (!email || typeof password !== "string" || !password) {
    return response.status(400).json({
      message: "Enter your email and password."
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !passwordMatches(password, user.salt, user.passwordHash)) {
      return response.status(401).json({
        message: "Email or password is incorrect."
      });
    }

    await regenerateSession(request);
    request.session.user = sessionUser(user);
    await saveSession(request);
    return response.status(200).json({
      message: "Sign in successful.",
      user: request.session.user
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", (request, response) => {
  response.json({ user: request.session && request.session.user || null });
});

router.put("/profile", requireAuth, async (request, response, next) => {
  const body = request.body || {};
  const name = String(body.name || "").trim();
  const enrollment = String(body.enrollment || "").trim().toUpperCase();

  if (name.length < 2) {
    return response.status(400).json({ message: "Name must be at least 2 characters." });
  }
  if (!enrollment || enrollment.length > 50) {
    return response.status(400).json({ message: "Enter a valid enrollment number." });
  }

  try {
    const user = await User.findById(request.session.user.id);
    if (!user) {
      request.session.destroy(() => {});
      return response.status(401).json({ message: "Please sign in again." });
    }

    user.name = name;
    user.enrollment = enrollment;
    await user.save();
    request.session.user = sessionUser(user);
    await saveSession(request);
    return response.json({ user: request.session.user });
  } catch (error) {
    return next(error);
  }
});

router.post("/signout", (request, response, next) => {
  if (!request.session) return response.status(200).json({ message: "Signed out." });

  request.session.destroy((error) => {
    if (error) return next(error);
    response.clearCookie("pulse.sid");
    return response.status(200).json({ message: "Signed out." });
  });
});

module.exports = router;
