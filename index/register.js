const form = document.querySelector("#register-form");
const message = document.querySelector("#confirmation");
const profileForm = document.querySelector("#profile-completion");
const profileMessage = document.querySelector("#profile-message");
const accountDetails = document.querySelector("#account-details");
const eventSelect = form.elements.namedItem("eventName");
const requestedEvent = new URLSearchParams(window.location.search).get("event");

message.setAttribute("role", "status");

function showMessage(text, isError) {
  message.textContent = text;
  message.hidden = false;
  message.setAttribute("aria-live", isError ? "assertive" : "polite");
}

function clearErrors() {
  form.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });
  form.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
  });
}

function showFieldError(fieldName, text) {
  const field = form.elements.namedItem(fieldName);
  const error = document.querySelector(`#err-${fieldName}`);

  if (field && error) {
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    error.textContent = text;
    field.focus();
  }
}

async function loadEvents() {
  const response = await fetch("/api/events");
  if (!response.ok) {
    throw new Error(`Could not load events (HTTP ${response.status}).`);
  }

  const events = await response.json();
  if (!Array.isArray(events)) {
    throw new Error("Could not load events.");
  }

  events.forEach((event) => {
    const option = document.createElement("option");
    option.value = event.title;
    option.textContent = event.title;
    eventSelect.appendChild(option);
  });

  if (requestedEvent) {
    const matchingEvent = events.find(
      (event) => event.title.toLowerCase() === requestedEvent.trim().toLowerCase()
    );

    if (matchingEvent) {
      eventSelect.value = matchingEvent.title;
    } else {
      showMessage("The event in this link could not be found. Please choose an event from the list.", true);
    }
  }
}

function showProfile(user) {
  accountDetails.textContent = `${user.name} · ${user.email} · ${user.enrollment}`;
  profileForm.hidden = true;
  document.querySelector("#registration-fields").disabled = false;
  form.hidden = false;
  loadEvents().catch((error) => {
    console.error("Could not load events for registration:", error);
    showMessage(error.message || "Could not load events. Please try again.", true);
  });
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileMessage.textContent = "Saving your profile...";
  try {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: profileForm.elements.namedItem("name").value,
        enrollment: profileForm.elements.namedItem("enrollment").value
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not update your profile.");
    showProfile(result.user);
  } catch (error) {
    profileMessage.textContent = error.message || "Could not update your profile.";
  }
});

async function checkSignedInUser() {
  const response = await fetch("/api/auth/me");
  if (!response.ok) throw new Error("Could not check your sign-in status.");
  const result = await response.json();
  if (!result.user) {
    const next = window.location.pathname + window.location.search;
    window.location.assign(`/index/signin.html?next=${encodeURIComponent(next)}`);
    return;
  }

  if (!result.user.name || !result.user.enrollment) {
    form.hidden = true;
    profileForm.hidden = false;
    profileForm.elements.namedItem("name").value = result.user.name || "";
    document.querySelector("#registration-fields").disabled = true;
    return;
  }

  showProfile(result.user);
}

checkSignedInUser().catch((error) => {
  console.error("Could not check sign-in status:", error);
  showMessage(error.message || "Please sign in before registering.", true);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  showMessage("Saving your registration...", false);

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form))
    });
    const result = await response.json();

    if (!response.ok) {
      if (result.field) showFieldError(result.field, result.message);
      showMessage(result.message || "Could not save your registration.", true);
      return;
    }

    showMessage(`${result.message} Your registration ID is ${result.id}.`, false);
    form.reset();
  } catch (error) {
    console.error("Could not save registration:", error);
    showMessage(error.message || "Could not save your registration. Please try again.", true);
  }
});
