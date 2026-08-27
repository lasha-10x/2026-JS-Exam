// == reusable validation rules (pure functions)

// Full Name: not empty after trimming, and at least 3 characters.
export function isValidName(name) {
  return name.trim().length >= 3;
}

export function isValidEmail(email) {
  // return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

// Password: at least 8 chars, at least 1 letter AND at least 1 number.
export function isStrongPassword(password) {
  const longEnough = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password); // any a–z or A–Z
  const hasNumber = /[0-9]/.test(password); // any 0–9
  return longEnough && hasLetter && hasNumber;
}
