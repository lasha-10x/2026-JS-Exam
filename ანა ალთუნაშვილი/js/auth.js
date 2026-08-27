/**
 * auth.js
 * ---------------------------------------------------------------------------
 * Sign Up (P1) and Login (P2) logic.
 *
 * Both forms follow the same shape:
 *   1. preventDefault() — we handle submission ourselves, no page reload.
 *   2. Validate every field, collecting ALL errors (not stopping at the
 *      first one) — the PRD requires every error to show at once.
 *   3. If there are errors: show them next to their fields, stop here.
 *   4. If valid: do the actual work (create user / create session),
 *      show a toast, then move on.
 * ---------------------------------------------------------------------------
 */

// Field-error helpers (setFieldError, clearFieldError, clearAllFieldErrors,
// liveClearOnInput) and the EMAIL_RE / HAS_LETTER_RE / HAS_DIGIT_RE regexes
// now live in validation.js — include it before this file.

// ============================================================================
// P1 — Sign Up
// ============================================================================

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const fieldNames = ['fullName', 'email', 'company', 'password', 'confirmPassword'];
  liveClearOnInput(fieldNames);

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // P1.2 — we validate ourselves, never a native reload
    clearAllFieldErrors(fieldNames);

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const company = document.getElementById('company').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let hasError = false;
    const users = Storage10X.getUsers();

    // Full Name — required, >= 3 chars after trim()
    if (fullName.length < 3) {
      setFieldError('fullName', 'Full name must be at least 3 characters');
      hasError = true;
    }

    // Email — required, valid shape
    if (!EMAIL_RE.test(email)) {
      setFieldError('email', 'Please enter a valid email address');
      hasError = true;
    } else if (users.some((u) => u.email === email)) {
      // Email — must not already exist (checked lowercase, via some())
      setFieldError('email', 'An account with this email already exists');
      hasError = true;
    }

    // Password — min 8 chars, at least 1 letter and 1 digit
    if (password.length < 8 || !HAS_LETTER_RE.test(password) || !HAS_DIGIT_RE.test(password)) {
      setFieldError('password', 'Password must be at least 8 characters and contain a letter and a number');
      hasError = true;
    }

    // Confirm Password — must match exactly
    if (confirmPassword !== password) {
      setFieldError('confirmPassword', 'Passwords do not match');
      hasError = true;
    }

    if (hasError) return; // nothing is saved, form does not submit

    // ---- P1.3 — successful registration, exact sequence -------------------
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password, // see security note in README — plaintext only OK in this learning project
      company,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    Storage10X.saveUsers(users);

    showToast('Account created successfully! Please log in.', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}

// ============================================================================
// P2 — Login
// ============================================================================

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const fieldNames = ['loginEmail', 'loginPassword'];
  liveClearOnInput(fieldNames);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllFieldErrors(fieldNames);

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    let hasError = false;

    if (!email) {
      setFieldError('loginEmail', 'Email is required');
      hasError = true;
    }
    if (!password) {
      setFieldError('loginPassword', 'Password is required');
      hasError = true;
    }
    if (hasError) return;

    // Deliberately generic error: we never reveal whether the email exists
    // or the password was wrong — see README "Security notes" for why.
    const users = Storage10X.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setFieldError('loginEmail', '');
      setFieldError('loginPassword', 'Invalid email or password');
      hasError = true;
    }
    if (hasError) return;

    // ---- P2.3 — successful login -------------------------------------
    const session = {
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString(),
    };
    Storage10X.saveSession(session);

    window.location.href = 'dashboard.html';
  });
}
