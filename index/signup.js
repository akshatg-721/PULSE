const form = document.querySelector("#sign-up-form");
const message = document.querySelector("#form-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  

  message.textContent = "Creating account...";

  try {
    const response = await fetch("/signup", {
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
    message.textContent = error.message || "Could not create your account. Please try again.";
  }
});
