const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataFile = path.join(root, "data", "users.json");

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
  "/index/signup.html": ["index/signup.html", "text/html"],
  "/index/signin.html": ["index/signin.html", "text/html"],
  "/index/signup.js": ["index/signup.js", "text/javascript"],
  "/index/signin.js": ["index/signin.js", "text/javascript"],
  "/styles/main.css": ["styles/main.css", "text/css"]
};

http.createServer((request, response) => {
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
}).listen(3000, "127.0.0.1", () => {
  console.log("PULSE is running at http://127.0.0.1:3000");
});
