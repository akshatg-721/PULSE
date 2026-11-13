/* ------------------------------------------------------------------ */
/* contact.js — Handles the Contact page form.                         */
/*                                                                     */
/* Pattern copied from register.js; only the field names, the fetch   */
/* endpoint (/contact) and the character counter are new.              */
/* ------------------------------------------------------------------ */

/* -- Top-level references to the two DOM elements we use everywhere -- */
const form    = document.querySelector("#contact-form");
const message = document.querySelector("#confirmation");

/* Tell screen-readers this element will announce status updates. */
message.setAttribute("role", "status");

/* ------------------------------------------------------------------ */
/* showMessage(text, isError)                                          */
/* Makes the confirmation box visible and fills it with text.         */
/* isError=true  → aria-live="assertive" (screen-reader interrupts)   */
/* isError=false → aria-live="polite"    (screen-reader waits turn)   */
/* ------------------------------------------------------------------ */
function showMessage(text, isError) {
  message.textContent = text;
  message.hidden = false;
  message.setAttribute("aria-live", isError ? "assertive" : "polite");
}

/* ------------------------------------------------------------------ */
/* clearErrors()                                                       */
/* Before every new submit attempt, wipe all previous error state so  */
/* we start from a clean slate.                                        */
/*   - Clears the text inside every <span class="error">              */
/*   - Removes the red-border "invalid" class from every field        */
/*   - Removes the aria-invalid attribute (accessibility)             */
/* ------------------------------------------------------------------ */
function clearErrors() {
  form.querySelectorAll(".error").forEach(function (errorSpan) {
    errorSpan.textContent = "";
  });
  form.querySelectorAll(".invalid").forEach(function (field) {
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
  });
}

/* ------------------------------------------------------------------ */
/* showFieldError(fieldName, text)                                     */
/* Highlights one field as invalid and shows a message beneath it.    */
/*   fieldName – the name="" attribute value, e.g. "email"            */
/*   text      – the error sentence to display                        */
/* Steps:                                                             */
/*   1. form.elements.namedItem("email") → finds <input name="email"> */
/*   2. Adds class "invalid" → register.css draws a red border        */
/*   3. Sets aria-invalid="true" → tells screen-readers it's wrong    */
/*   4. Puts the message into <span id="err-email">                   */
/*   5. field.focus() → moves the cursor back to the bad field        */
/* ------------------------------------------------------------------ */
function showFieldError(fieldName, text) {
  const field = form.elements.namedItem(fieldName);
  const errorSpan = document.querySelector("#err-" + fieldName);

  if (field && errorSpan) {
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    errorSpan.textContent = text;
    field.focus();
  }
}

/* ------------------------------------------------------------------ */
/* Character counter                                                   */
/* Fires on every keystroke inside the textarea.                      */
/* "input" fires after the character is already in the box, so        */
/* field.value.length is always up-to-date.                           */
/* ------------------------------------------------------------------ */
const messageField = document.querySelector("#message");
const charCount    = document.querySelector("#char-count");

messageField.addEventListener("input", function () {
  charCount.textContent = messageField.value.length + " / 500";
});

/* ------------------------------------------------------------------ */
/* validate()                                                          */
/* Checks every field BEFORE sending anything to the server.          */
/* Returns true if everything is fine, false if something is wrong.   */
/*                                                                     */
/* Uses a "rules array": each entry is [fieldName, condition, msg].   */
/*   condition = true  means the field FAILS (the rule is violated)   */
/*   condition = false means the field PASSES                         */
/*                                                                     */
/* find() stops at the FIRST failed rule and shows only that one      */
/* error. We show one error at a time — same behaviour as register.js */
/* ------------------------------------------------------------------ */
function validate() {
  const nameVal    = form.elements.namedItem("name").value.trim();
  const emailVal   = form.elements.namedItem("email").value.trim();
  const subjectVal = form.elements.namedItem("subject").value;
  const msgVal     = form.elements.namedItem("message").value.trim();

  const rules = [
    ["name",    nameVal.length < 2,
                "Name must be at least 2 characters."],
    ["email",   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal),
                "Enter a valid email address."],
    ["subject", !subjectVal,
                "Please choose a subject."],
    ["message", msgVal.length < 10,
                "Message must be at least 10 characters."]
  ];

  /* find() returns the first array entry whose condition (index 1) is true */
  const failed = rules.find(function (rule) { return rule[1]; });

  if (failed) {
    showFieldError(failed[0], failed[2]);
    return false;   /* stop — do not submit */
  }

  return true;      /* all clear — allow submit */
}

/* ------------------------------------------------------------------ */
/* Submit handler                                                      */
/* Runs when the user clicks "Send message".                          */
/* ------------------------------------------------------------------ */
form.addEventListener("submit", async function (event) {

  /* 1. Stop the browser from reloading the page (default form action) */
  event.preventDefault();

  /* 2. Wipe any errors from a previous attempt */
  clearErrors();

  /* 3. Run client-side checks. If any fail, stop here. */
  if (!validate()) return;

  /* 4. Optimistic UI: tell the user something is happening */
  showMessage("Sending your message...", false);

  try {
    /*
     * 5. Send the data to the server.
     *
     * new FormData(form)        – reads every <input>, <select>,
     *                             <textarea> inside the form into a
     *                             key/value collection.
     * new URLSearchParams(...)  – converts that collection into the
     *                             text format the server expects:
     *                             name=Alice&email=a@b.com&...
     * Content-Type header       – tells the server "the body is in
     *                             URL-encoded format". The server
     *                             then uses URLSearchParams to decode it.
     */
    const response = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form))
    });

    /*
     * 6. Parse the JSON the server always sends back.
     *    { message: "...", id: "MSG-12345" }   on success
     *    { message: "...", field: "email" }     on validation error
     */
    const result = await response.json();

    /*
     * 7. response.ok is true for HTTP 200–299, false for 400/409/500.
     *    If the server rejected the data, highlight the bad field and
     *    show the server's own error sentence.
     */
    if (!response.ok) {
      if (result.field) showFieldError(result.field, result.message);
      showMessage(result.message || "Could not send your message.", true);
      return;
    }

    /* 8. Success path */
    showMessage(result.message + " Your reference is " + result.id + ".", false);
    form.reset();

    /* Reset the character counter because form.reset() cleared the textarea */
    charCount.textContent = "0 / 500";

  } catch (error) {
    /*
     * This catch block only runs for network-level failures
     * (server is down, no internet, DNS error).
     * HTTP 400/500 do NOT reach here — they go through the if(!response.ok) path.
     */
    console.error("Could not send contact message:", error);
    showMessage("Could not send your message. Please try again.", true);
  }
});
