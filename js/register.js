const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{9,11}$/;

/* filed validation func */
function validateName(value) {
  if (!value.trim()) return "Full name is required.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(value.trim())) return "Email format is invalid.";
  return "";
}

function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
}

function validatePhone(value) {
  if (!value.trim()) return "Phone number is required.";
  if (!PHONE_REGEX.test(value.trim())) return "Phone number is invalid.";
  return "";
}

function validateTopic(value) {
  if (!value) return "Please choose a contact topic.";
  return "";
}

function validateTerms(checked) {
  if (!checked) return "You must agree to the terms and conditions.";
  return "";
}

function validateForm(form) {
    const results = {
        name: validateName(form.name.value),
        email: validateEmail(form.email.value),
        password: validatePassword(form.password.value),
        phone: validatePhone(form.phone.value),
        topic: validateTopic(form.topic.value),
        terms: validateTerms(form.terms.checked),
    };

    Object.entries(results).forEach(([field, message]) => {
        setFieldError(field, message);
    });

    // Valid when every message is empty.
    return Object.values(results).every((message) => message === "");
}

/* render errors helpers */
function setFieldError(name, message) {
    const errorEl = document.querySelector(`[data-error="${name}"]`);
    const inputEl = document.getElementById(name);
    if (errorEl) errorEl.textContent = message;

    if (inputEl) {
        inputEl.classList.toggle("border-red-500", Boolean(message));
        inputEl.classList.toggle("border-gray-300", !message);
    }
}

/* Get data from form */
function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return; 

  const successEl = document.getElementById("form-success");

  // Validate a field when user leaves it 
  ["name", "email", "password", "phone", "topic"].forEach((field) => {
    form[field].addEventListener("blur", () => {
      const validators = {
        name: validateName,
        email: validateEmail,
        password: validatePassword,
        phone: validatePhone,
        topic: validateTopic,
      };

      setFieldError(field, validators[field](form[field].value));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successEl.classList.add("hidden");

    if (!validateForm(form)) return;

    successEl.classList.remove("hidden");
    form.reset();
    ["name", "email", "password", "phone", "topic", "terms"].forEach((field) =>
      setFieldError(field, "")
    );
  });
}

document.addEventListener("DOMContentLoaded", initRegisterForm);
