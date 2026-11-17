const eventForm = document.querySelector("#event-form");
const eventList = document.querySelector("#event-list");
const eventMessage = document.querySelector("#event-message");
const attendanceForm = document.querySelector("#attendance-form");
const markMessage = document.querySelector("#mark-message");
const attendanceFilter = document.querySelector("#attendance-filter");
const attendanceList = document.querySelector("#attendance-list");
const attendanceMessage = document.querySelector("#attendance-message");
const saveButton = document.querySelector("#event-save");
const cancelButton = document.querySelector("#event-cancel");

let events = [];

async function api(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || `Request failed (${response.status}).`);
  return result;
}

function fieldValue(form, name) {
  return form.elements.namedItem(name).value.trim();
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

function renderEventSelectors() {
  const markEvent = attendanceForm.elements.namedItem("eventSlug");
  const filterEvent = attendanceFilter.elements.namedItem("event");
  const filterClub = attendanceFilter.elements.namedItem("club");
  const selectedEvent = filterEvent.value;
  const selectedClub = filterClub.value;

  markEvent.replaceChildren();
  filterEvent.replaceChildren();
  filterClub.replaceChildren();
  const markPlaceholder = document.createElement("option");
  markPlaceholder.value = "";
  markPlaceholder.textContent = "Choose an event";
  markPlaceholder.disabled = true;
  markPlaceholder.selected = true;
  markEvent.appendChild(markPlaceholder);
  addOption(filterEvent, "", "All events");
  addOption(filterClub, "", "All clubs");

  const clubs = new Set();
  events.forEach((event) => {
    addOption(markEvent, event.slug, `${event.title}${event.isActive ? "" : " (archived)"}`);
    addOption(filterEvent, event.slug, `${event.title}${event.isActive ? "" : " (archived)"}`);
    clubs.add(event.club);
  });
  Array.from(clubs).sort().forEach((club) => addOption(filterClub, club, club));

  filterEvent.value = selectedEvent;
  filterClub.value = selectedClub;
}

function renderEvents() {
  eventList.replaceChildren();
  if (!events.length) {
    const empty = document.createElement("p");
    empty.textContent = "No events have been created.";
    eventList.appendChild(empty);
    return;
  }

  events.forEach((event) => {
    const row = document.createElement("article");
    row.className = "event-row";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = event.title;
    const meta = document.createElement("p");
    meta.textContent = `${event.club} · ${event.date} · ${event.isActive ? "Active" : "Archived"}`;
    details.append(title, meta);

    const controls = document.createElement("div");
    controls.className = "event-controls";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "button-secondary";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editEvent(event));
    controls.appendChild(edit);

    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = event.isActive ? "danger" : "button-secondary";
    statusButton.textContent = event.isActive ? "Archive" : "Restore";
    statusButton.addEventListener("click", () => toggleEvent(event));
    controls.appendChild(statusButton);

    row.append(details, controls);
    eventList.appendChild(row);
  });
}

function editEvent(event) {
  eventForm.elements.namedItem("slug").value = event.slug;
  ["title", "category", "date", "time", "venue", "club", "description"]
    .forEach((field) => {
      eventForm.elements.namedItem(field).value = event[field];
    });
  document.querySelector("#event-form-title").textContent = "Edit event";
  saveButton.textContent = "Save changes";
  cancelButton.hidden = false;
  eventForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetEventForm() {
  eventForm.reset();
  eventForm.elements.namedItem("slug").value = "";
  document.querySelector("#event-form-title").textContent = "Create an event";
  saveButton.textContent = "Create event";
  cancelButton.hidden = true;
}

async function loadEvents() {
  const result = await api("/api/admin/events");
  events = result;
  renderEvents();
  renderEventSelectors();
}

async function toggleEvent(event) {
  const action = event.isActive ? "archive" : "restore";
  if (event.isActive && !window.confirm(`Archive "${event.title}"? Existing attendance and registrations will be kept.`)) {
    return;
  }
  try {
    await api(`/api/admin/events/${encodeURIComponent(event.slug)}${event.isActive ? "" : "/restore"}`, {
      method: event.isActive ? "DELETE" : "PATCH"
    });
    eventMessage.textContent = `Event ${action}d.`;
    await loadEvents();
    await loadAttendance();
  } catch (error) {
    eventMessage.textContent = error.message;
  }
}

async function loadAttendance() {
  attendanceMessage.textContent = "Loading attendance...";
  try {
    const query = new URLSearchParams({
      event: fieldValue(attendanceFilter, "event"),
      club: fieldValue(attendanceFilter, "club")
    });
    const records = await api(`/api/admin/attendance?${query}`);
    attendanceList.replaceChildren();
    records.forEach((record) => {
      const row = document.createElement("tr");
      [
        record.eventName,
        record.club,
        record.name,
        record.email,
        record.enrollment,
        new Date(record.attendedAt).toLocaleString()
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value || "";
        row.appendChild(cell);
      });
      attendanceList.appendChild(row);
    });
    attendanceMessage.textContent = `${records.length} attendance record(s).`;
  } catch (error) {
    attendanceMessage.textContent = error.message;
  }
}

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  eventMessage.textContent = "Saving event...";
  const slug = fieldValue(eventForm, "slug");
  const body = {};
  ["title", "category", "date", "time", "venue", "club", "description"]
    .forEach((field) => {
      body[field] = fieldValue(eventForm, field);
    });
  try {
    await api(slug ? `/api/admin/events/${encodeURIComponent(slug)}` : "/api/admin/events", {
      method: slug ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    eventMessage.textContent = slug ? "Event updated." : "Event created.";
    resetEventForm();
    await loadEvents();
  } catch (error) {
    eventMessage.textContent = error.message;
  }
});

cancelButton.addEventListener("click", resetEventForm);

attendanceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  markMessage.textContent = "Recording attendance...";
  try {
    const result = await api("/api/admin/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventSlug: fieldValue(attendanceForm, "eventSlug"),
        enrollment: fieldValue(attendanceForm, "enrollment")
      })
    });
    markMessage.textContent = result.message;
    attendanceForm.elements.namedItem("enrollment").value = "";
    await loadAttendance();
  } catch (error) {
    markMessage.textContent = error.message;
  }
});

attendanceFilter.addEventListener("submit", (event) => {
  event.preventDefault();
  loadAttendance();
});

async function initialize() {
  try {
    await loadEvents();
    await loadAttendance();
  } catch (error) {
    eventMessage.textContent = error.message;
  }
}

initialize();
