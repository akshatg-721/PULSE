const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataFile = path.join(root, "data", "users.json");
const registrationsFile = path.join(root, "data", "registrations.json");
const port = Number(process.env.PORT) || 3000;

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function readUsers() {
  if (!fs.existsSync(dataFile)) return [];
  const file = fs.readFileSync(dataFile, "utf8").trim();
  return file ? JSON.parse(file) : [];
}

const pages = {
  "/": ["index/main.html", "text/html"],
  "/index/main.html": ["index/main.html", "text/html"],
  "/index/reels.html": ["index/reels.html", "text/html"],
  "/index/reels.js": ["index/reels.js", "text/javascript"],
  "/index/clubs.html": ["index/clubs.html", "text/html"],
  "/index/about.html": ["index/about.html", "text/html"],
  "/index/team.html": ["index/team.html", "text/html"],
  "/index/register.html": ["index/register.html", "text/html"],
  "/index/register.js": ["index/register.js", "text/javascript"],
  "/index/signup.html": ["index/signup.html", "text/html"],
  "/index/signin.html": ["index/signin.html", "text/html"],
  "/index/signup.js": ["index/signup.js", "text/javascript"],
  "/index/signin.js": ["index/signin.js", "text/javascript"],
  "/index/nav.js": ["index/nav.js", "text/javascript"],
  "/index/nav.css": ["index/nav.css", "text/css"],
  "/index/events.html": ["index/events.html", "text/html"],
  "/index/events.js": ["index/events.js", "text/javascript"],
  "/styles/main.css": ["styles/main.css", "text/css"],
  "/styles/reels.css": ["styles/reels.css", "text/css"],
  "/styles/register.css": ["styles/register.css", "text/css"],
  "/styles/events.css": ["styles/events.css", "text/css"]
};

http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/register") {
    let body = "";
    request.on("data", (chunk) => body += chunk);
    request.on("end", () => {
      // --- Parse all fields from the submitted form body ---
      const form       = new URLSearchParams(body);
      const name       = form.get("name")?.trim()       ?? "";
      const email      = form.get("email")?.trim().toLowerCase() ?? "";
      const phone      = form.get("phone")?.trim()      ?? "";
      const course     = form.get("course")?.trim()     ?? "";
      const year       = form.get("year")?.trim()       ?? "";
      const enrollment = form.get("enrollment")?.trim() ?? "";
      const eventName  = form.get("eventName")?.trim()  ?? "";
      const agree      = form.get("agree")?.trim()      ?? "";

      // --- Validate each field in order; return the first failure ---
      const bad = (message, field) => {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message, field }));
      };

      if (name.length < 2)
        return bad("Name must be at least 2 characters.", "name");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return bad("Enter a valid email address.", "email");

      if (!/^\d{10}$/.test(phone))
        return bad("Phone must be exactly 10 digits.", "phone");

      if (!course)
        return bad("Course is required.", "course");

      if (!["1", "2", "3", "4"].includes(year))
        return bad("Year must be 1, 2, 3, or 4.", "year");

      if (!enrollment)
        return bad("Enrollment number is required.", "enrollment");

      if (agree !== "on" && agree !== "true")
        return bad("You must agree to the terms.", "agree");

      // --- Load events.json to validate the chosen event name ---
      const eventsFilePath = path.join(root, "data", "events.json");
      let validEventTitles = [];
      try {
        const raw = fs.existsSync(eventsFilePath)
          ? fs.readFileSync(eventsFilePath, "utf8").trim()
          : "";
        const parsed = raw ? JSON.parse(raw) : [];
        validEventTitles = Array.isArray(parsed)
          ? parsed.map((e) => e.title)
          : [];
      } catch (_) {
        // If events.json is unreadable, fall through with an empty list
        // so the eventName check below returns a clear 400.
      }

      if (!validEventTitles.includes(eventName))
        return bad("Choose a valid event from the list.", "eventName");

      // --- Read existing registrations (empty array if file is missing/corrupt) ---
      try {
        fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });

        let registrations = [];
        try {
          const raw = fs.existsSync(registrationsFile)
            ? fs.readFileSync(registrationsFile, "utf8").trim()
            : "";
          registrations = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(registrations)) registrations = [];
        } catch (_) {
          // Corrupt file — start fresh rather than blocking all registrations.
          registrations = [];
        }

        // --- Reject duplicate: same email + same eventName (case-insensitive) ---
        const duplicate = registrations.some(
          (r) =>
            r.email?.toLowerCase() === email &&
            r.eventName?.toLowerCase() === eventName.toLowerCase()
        );
        if (duplicate) {
          response.writeHead(409, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              message: `You are already registered for "${eventName}".`
            })
          );
          return;
        }

        // --- Generate a unique PULSE-XXXXX ID ---
        const existingIds = new Set(registrations.map((r) => r.id));
        let id;
        do {
          id = "PULSE-" + String(Math.floor(10000 + Math.random() * 90000));
        } while (existingIds.has(id));

        // --- Append the new record and persist ---
        const record = {
          id,
          name,
          email,
          phone,
          course,
          year,
          enrollment,
          eventName,
          createdAt: new Date().toISOString()
        };
        registrations.push(record);
        fs.writeFileSync(
          registrationsFile,
          JSON.stringify(registrations, null, 2)
        );

        // --- Return success with the new ID ---
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            message: "Registration successful.",
            id,
            eventName,
            name
          })
        );
      } catch (error) {
        console.error("Could not save registration:", error);
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            message: "Could not save your registration. Please try again."
          })
        );
      }
    });
    return;
  }

  if (request.method === "POST" && request.url === "/signin") {
    let body = "";
    request.on("data", (chunk) => body += chunk);
    request.on("end", () => {
      const form = new URLSearchParams(body);
      const email = form.get("email")?.trim().toLowerCase();
      const password = form.get("password");

      if (!email || !password) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Enter your email and password." }));
        return;
      }

      try {
        const users = readUsers();
        const user = users.find((item) => item.email === email);
        const savedHash = user && typeof user.salt === "string" && /^[a-f0-9]{128}$/i.test(user.password)
          ? Buffer.from(user.password, "hex")
          : Buffer.alloc(0);
        const enteredHash = user && savedHash.length
          ? crypto.scryptSync(password, user.salt, 64)
          : Buffer.alloc(0);
        const passwordMatches = savedHash.length === enteredHash.length
          && savedHash.length > 0
          && crypto.timingSafeEqual(savedHash, enteredHash);

        if (!passwordMatches) {
          response.writeHead(401, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ message: "Email or password is incorrect." }));
          return;
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Sign in successful." }));
      } catch (error) {
        console.error("Could not read users data:", error);
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Could not check users. Please try again." }));
      }
    });
    return;
  }

  if (request.method === "POST" && request.url === "/signup") {
    let body = "";
    request.on("data", (chunk) => body += chunk);
    request.on("end", () => {
      const form = new URLSearchParams(body);
      const email = form.get("email")?.trim().toLowerCase();
      const password = form.get("password");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 6) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Enter a valid email and a password of at least 6 characters." }));
        return;
      }

      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      const users = readUsers();
      if (users.some((user) => user.email === email)) {
        response.writeHead(409, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "An account with this email already exists." }));
        return;
      }

      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = hashPassword(password, salt);
      users.push({ email, salt, password: passwordHash, createdAt: new Date().toISOString() });
      fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Account created. You can sign in here later." }));
    });
    return;
  }

  // GET /api/events — reads data/events.json and returns the array as JSON.
  // Returns an empty array if the file is missing or contains invalid JSON.
  if (request.method === "GET" && request.url === "/api/events") {
    const eventsFile = path.join(root, "data", "events.json");
    try {
      const raw = fs.existsSync(eventsFile)
        ? fs.readFileSync(eventsFile, "utf8").trim()
        : "";
      const data = raw ? JSON.parse(raw) : [];
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Could not read events data:", error);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify([]));
    }
    return;
  }

  const page = pages[request.url];
  if (!page || request.method !== "GET") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.readFile(path.join(root, page[0]), (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end("Could not load page.");
      return;
    }
    response.writeHead(200, { "Content-Type": page[1] });
    response.end(content);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`PULSE is running at http://127.0.0.1:${port}`);
});
