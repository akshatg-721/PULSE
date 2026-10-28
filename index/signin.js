const form = document.querySelector("#sign-in-form");
const message = document.querySelector("#form-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Checking your details...";

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: form.email.value,
        password: form.password.value
      })
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message);
    message.textContent = result.message;
    form.reset();
  } catch (error) {
    message.textContent = error.message || "Could not sign in. Please try again.";
  }
});
