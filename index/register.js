const form = document.querySelector("#register-form");
const message = document.querySelector("#form-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Saving your registration...";

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: form.username.value,
        eventName: form.eventName.value,
        enrollment: form.enrollment.value
      })
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    message.textContent = result.message;
    form.reset();
  } catch (error) {
    message.textContent = error.message || "Could not save your registration. Please try again.";
  }
});
