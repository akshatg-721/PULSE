const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDatabase = require("./config/database");
const ensureAdminAccount = require("./services/admin-account");
const { requireAdmin } = require("./middleware/auth");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const Event = require("./models/Event");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");

const app = express();
const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is missing. Set it in the .env file.");
}
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(session({
  name: "pulse.sid",
  secret: sessionSecret,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);

app.use("/register", registrationRoutes);
app.use("/contact", contactRoutes);
app.use("/", authRoutes);

app.get("/admin", requireAdmin, (request, response) => {
  response.sendFile(path.join(root, "admin", "index.html"));
});
app.get("/admin/admin.js", requireAdmin, (request, response) => {
  response.sendFile(path.join(root, "admin", "admin.js"));
});

app.get("/", (request, response) => {
  response.sendFile(path.join(root, "index", "main.html"));
});

app.use("/index", express.static(path.join(root, "index"), { index: false }));
app.use("/styles", express.static(path.join(root, "styles"), { index: false }));
app.use("/assets", express.static(path.join(root, "assets"), { index: false }));

app.use((request, response) => {
  response.status(404).send("Not found");
});

app.use((error, request, response, next) => {
  console.error("Request failed:", error);
  if (response.headersSent) return next(error);
  response.status(500).json({ message: "An unexpected server error occurred." });
});

async function start() {
  await connectDatabase();
  const capacityCleanup = await Event.collection.updateMany(
    { capacity: { $exists: true } },
    { $unset: { capacity: "" } }
  );
  if (capacityCleanup.modifiedCount) {
    console.log(`Removed capacity from ${capacityCleanup.modifiedCount} existing event(s).`);
  }
  await ensureAdminAccount();
  app.listen(port, process.env.HOST || "0.0.0.0", () => {
    console.log(`PULSE is running at http://127.0.0.1:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Could not start PULSE:", error);
    process.exitCode = 1;
  });
}

module.exports = app;
