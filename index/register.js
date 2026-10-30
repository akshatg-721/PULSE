const form = document.querySelector("#register-form");
const message = document.querySelector("#confirmation");
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

loadEvents().catch((error) => {
  console.error("Could not load events for registration:", error);
  showMessage(error.message || "Could not load events. Please try again.", true);
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
