function requireAuth(request, response, next) {
  if (request.session && request.session.user) return next();

  if (request.method === "GET"
      && !request.originalUrl.startsWith("/api/")
      && request.accepts("html")) {
    const nextPath = encodeURIComponent(request.originalUrl);
    return response.redirect(`/index/signin.html?next=${nextPath}`);
  }

  return response.status(401).json({ message: "Please sign in to continue." });
}

function requireAdmin(request, response, next) {
  if (request.session && request.session.user && request.session.user.role === "admin") {
    return next();
  }

  if (request.method === "GET"
      && !request.originalUrl.startsWith("/api/")
      && request.accepts("html")) {
    const destination = request.session && request.session.user
      ? "/"
      : `/index/signin.html?next=${encodeURIComponent(request.originalUrl)}`;
    return response.redirect(destination);
  }

  const status = request.session && request.session.user ? 403 : 401;
  const message = status === 403
    ? "Administrator access is required."
    : "Please sign in as an administrator.";
  return response.status(status).json({ message });
}

module.exports = { requireAuth, requireAdmin };
