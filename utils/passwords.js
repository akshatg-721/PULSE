const crypto = require("crypto");

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return {
    salt,
    passwordHash: crypto.scryptSync(password, salt, 64).toString("hex")
  };
}

function passwordMatches(password, salt, savedHash) {
  if (typeof salt !== "string" || !/^[a-f0-9]{128}$/i.test(savedHash || "")) {
    return false;
  }

  const expected = Buffer.from(savedHash, "hex");
  const entered = crypto.scryptSync(password, salt, 64);
  return expected.length === entered.length && crypto.timingSafeEqual(expected, entered);
}

module.exports = { createPasswordHash, passwordMatches };
