const User = require("../models/User");
const { createPasswordHash } = require("../utils/passwords");

async function ensureAdminAccount() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    throw new Error("Admin credentials are invalid; use a valid email and a password of at least 8 characters.");
  }

  let admin = await User.findOne({ email });
  if (!admin) {
    admin = new User({
      name: "PULSE Admin",
      email,
      role: "admin",
      ...createPasswordHash(password)
    });
    await admin.save();
    console.log(`Created admin account for ${email}.`);
    return;
  }

  if (admin.role !== "admin") {
    Object.assign(admin, {
      name: admin.name || "PULSE Admin",
      role: "admin",
      ...createPasswordHash(password)
    });
    await admin.save();
  }
}

module.exports = ensureAdminAccount;
