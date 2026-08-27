// Small, dependency-free validation helpers shared by authentication and client forms.
/** Performs a lightweight format check suitable for the learning-project forms. */
export function isValidEmail(email) {
  const normalizedEmail = email.trim();
  const atIndex = normalizedEmail.indexOf("@");
  return atIndex > 0 && normalizedEmail.indexOf(".", atIndex) > atIndex + 1;
}

/** Requires at least eight characters containing both a letter and a number. */
export function isValidPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

/** Scores a password for the registration strength indicator. */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, level: "empty" };

  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
    password.length >= 12
  ];
  const score = checks.filter(Boolean).length;
  const level = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";

  return { score, level };
}
