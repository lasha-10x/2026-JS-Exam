/**
 * auth.js — handles login, signup with OTP email verification,
 * forgot-password flow, enhanced password-strength meter, and
 * show/hide password toggles.
 *
 * All "email sending" is simulated: the OTP is displayed directly
 * in the UI inside a styled banner (since this is a frontend-only app).
 */

document.addEventListener("DOMContentLoaded", () => {
  // ─── Constants ─────────────────────────────────────────────────────────────
  const USERS_KEY = "crm_users";
  const SESSION_KEY = "crm_session";
  const PENDING_KEY = "crm_pending_verifications";
  const OTP_TTL_MS = 10 * 60 * 1000; // OTP expires after 10 minutes
  const RESEND_COOLDOWN_S = 60; // seconds before resend is allowed

  // ─── Toast helper ──────────────────────────────────────────────────────────
  const toastEl = document.getElementById("toast");

  function showToast(message, type = "success") {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = `${type} show`;
    window.setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  // ─── Field error helpers ───────────────────────────────────────────────────
  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add("input-error");
    if (error) error.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));
    document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  }

  // ─── User storage ──────────────────────────────────────────────────────────
  function getUsers() {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!stored || !stored.length) {
      const defaults = [
        {
          id: 1001,
          fullName: "Demo Evaluator",
          email: "demo@test.com",
          password: "Password123",
          company: "10X Demo Corp",
          createdAt: new Date().toISOString(),
          emailVerified: true,
        },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return stored;
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ─── Validation helpers ────────────────────────────────────────────────────
  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function passwordMeetsRequirements(pw) {
    return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);
  }

  // ─── Enhanced password strength ────────────────────────────────────────────
  const STRENGTH_LEVELS = [
    { label: "Too weak", color: "#ef4444" },
    { label: "Weak",     color: "#f97316" },
    { label: "Fair",     color: "#eab308" },
    { label: "Good",     color: "#84cc16" },
    { label: "Strong",   color: "#22c55e" },
  ];

  const RULES = {
    length: (pw) => pw.length >= 8,
    upper:  (pw) => /[A-Z]/.test(pw),
    lower:  (pw) => /[a-z]/.test(pw),
    number: (pw) => /\d/.test(pw),
    symbol: (pw) => /[^a-zA-Z\d]/.test(pw),
  };

  /**
   * Attaches live strength-meter + checklist behaviour to a password input.
   * @param {string} inputId   — id of the <input type="password">
   * @param {string} meterId   — id of the .password-strength container
   * @param {string} listId    — id of the .pw-checklist <ul>
   */
  function attachStrengthMeter(inputId, meterId, listId) {
    const input = document.getElementById(inputId);
    const meter = document.getElementById(meterId);
    const list  = document.getElementById(listId);
    if (!input || !meter) return;

    const segs  = meter.querySelectorAll(".seg");
    const label = meter.querySelector(".strength-label");

    input.addEventListener("input", () => {
      const pw    = input.value;
      const score = Object.values(RULES).filter((fn) => fn(pw)).length; // 0–5

      // Colour segments
      segs.forEach((seg, i) => {
        const active = i < score;
        seg.style.background = active ? STRENGTH_LEVELS[Math.max(score - 1, 0)].color : "";
        seg.classList.toggle("filled", active);
      });

      // Label
      if (label) {
        label.textContent = pw ? STRENGTH_LEVELS[Math.max(score - 1, 0)].label : "";
        label.style.color = pw ? STRENGTH_LEVELS[Math.max(score - 1, 0)].color : "";
      }

      // Checklist
      if (list) {
        list.querySelectorAll("li").forEach((li) => {
          const rule = li.dataset.rule;
          const pass = RULES[rule]?.(pw) ?? false;
          li.classList.toggle("rule-pass", pass);
          li.querySelector("i").className = pass
            ? "fa-solid fa-circle-check"
            : "fa-solid fa-circle-xmark";
        });
      }
    });
  }

  // ─── Show/hide password toggles ───────────────────────────────────────────
  document.querySelectorAll(".pw-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isText = target.type === "text";
      target.type = isText ? "password" : "text";
      btn.querySelector("i").className = isText
        ? "fa-solid fa-eye"
        : "fa-solid fa-eye-slash";
    });
  });

  // ─── OTP utilities ────────────────────────────────────────────────────────
  function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function storePendingVerification(email, otp, extra = {}) {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
    pending[email] = { otp, createdAt: Date.now(), ...extra };
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }

  function getPendingVerification(email) {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
    return pending[email] ?? null;
  }

  function clearPendingVerification(email) {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
    delete pending[email];
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }

  // ─── OTP input boxes (split 6 individual cells) ───────────────────────────
  function initOtpBoxes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const boxes = [...container.querySelectorAll(".otp-box")];

    boxes.forEach((box, idx) => {
      box.addEventListener("input", (e) => {
        const val = e.target.value.replace(/\D/g, "");
        box.value = val.slice(-1); // keep only last digit
        if (val && idx < boxes.length - 1) boxes[idx + 1].focus();
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && idx > 0) {
          boxes[idx - 1].focus();
        }
        if (e.key === "ArrowLeft" && idx > 0) boxes[idx - 1].focus();
        if (e.key === "ArrowRight" && idx < boxes.length - 1) boxes[idx + 1].focus();
      });

      // Handle paste on any box
      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
        digits.split("").forEach((d, i) => {
          if (boxes[idx + i]) boxes[idx + i].value = d;
        });
        const nextEmpty = boxes.findIndex((b, i) => i >= idx && !b.value);
        (nextEmpty >= 0 ? boxes[nextEmpty] : boxes[boxes.length - 1]).focus();
      });
    });
  }

  function getOtpValue(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return "";
    return [...container.querySelectorAll(".otp-box")].map((b) => b.value).join("");
  }

  function clearOtpBoxes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll(".otp-box").forEach((b) => (b.value = ""));
    container.querySelector(".otp-box")?.focus();
  }

  // ─── Resend cooldown timer ────────────────────────────────────────────────
  function startResendCooldown(btnId, timerId) {
    const btn   = document.getElementById(btnId);
    const timer = document.getElementById(timerId);
    if (!btn) return;
    btn.disabled = true;
    let remaining = RESEND_COOLDOWN_S;

    const tick = () => {
      if (timer) timer.textContent = `(${remaining}s)`;
      if (remaining <= 0) {
        btn.disabled = false;
        if (timer) timer.textContent = "";
        return;
      }
      remaining--;
      window.setTimeout(tick, 1000);
    };
    tick();
  }

  // ─── SIGNUP FLOW ──────────────────────────────────────────────────────────
  const signupForm       = document.getElementById("signup-form");
  const signupStepForm   = document.getElementById("signup-step-form");
  const signupStepVerify = document.getElementById("signup-step-verify");
  const signupVerifyForm = document.getElementById("signup-verify-form");

  // Wire strength meter for signup
  attachStrengthMeter("signup-password", "password-strength", "signup-pw-checklist");

  // Pending signup data carried from step 1 to step 2
  let pendingSignupData = null;

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const fullName        = document.getElementById("signup-name").value.trim();
      const email           = document.getElementById("signup-email").value.trim().toLowerCase();
      const company         = document.getElementById("signup-company").value.trim();
      const password        = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;
      const users = getUsers();
      let valid = true;

      if (fullName.length < 3) {
        showError("signup-name", "signup-name-error", "Full name must be at least 3 characters");
        valid = false;
      }
      if (!isValidEmail(email)) {
        showError("signup-email", "signup-email-error", "Please enter a valid email address");
        valid = false;
      } else if (users.some((u) => u.email === email)) {
        showError("signup-email", "signup-email-error", "An account with this email already exists");
        valid = false;
      }
      if (!passwordMeetsRequirements(password)) {
        showError("signup-password", "signup-password-error",
          "Password must be at least 8 chars with a letter and a number");
        valid = false;
      }
      if (password !== confirmPassword) {
        showError("signup-confirm-password", "signup-confirm-error", "Passwords do not match");
        valid = false;
      }
      if (!valid) {
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      // Store pending signup data and generate OTP
      pendingSignupData = { fullName, email, company: company || "N/A", password };
      const otp = generateOtp();
      storePendingVerification(email, otp, { type: "signup" });

      // Show verification step
      signupStepForm.classList.add("hidden");
      signupStepVerify.classList.remove("hidden");

      document.getElementById("signup-banner-email").textContent = email;
      document.getElementById("signup-otp-display").textContent  = otp;

      initOtpBoxes("signup-otp-boxes");
      document.querySelector("#signup-otp-boxes .otp-box")?.focus();
      startResendCooldown("signup-resend-btn", "signup-resend-timer");

      showToast("Verification code generated!", "info");
    });
  }

  if (signupVerifyForm) {
    signupVerifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const entered = getOtpValue("signup-otp-boxes");
      const email   = pendingSignupData?.email;
      const record  = getPendingVerification(email);

      if (!record) {
        document.getElementById("signup-otp-error").textContent = "Session expired. Please start again.";
        return;
      }
      if (Date.now() - record.createdAt > OTP_TTL_MS) {
        clearPendingVerification(email);
        document.getElementById("signup-otp-error").textContent = "Code expired. Please request a new one.";
        return;
      }
      if (entered !== record.otp) {
        document.getElementById("signup-otp-error").textContent = "Incorrect code. Please try again.";
        clearOtpBoxes("signup-otp-boxes");
        return;
      }

      // ✅ OTP correct — create the account
      const users = getUsers();
      users.push({
        id: Date.now(),
        fullName:      pendingSignupData.fullName,
        email:         pendingSignupData.email,
        password:      pendingSignupData.password,
        company:       pendingSignupData.company,
        createdAt:     new Date().toISOString(),
        emailVerified: true,
      });
      saveUsers(users);
      clearPendingVerification(email);

      showToast("Account created! Redirecting to login…");
      window.setTimeout(() => { window.location.href = "index.html"; }, 1600);
    });
  }

  // Resend OTP (signup)
  document.getElementById("signup-resend-btn")?.addEventListener("click", () => {
    if (!pendingSignupData) return;
    const otp = generateOtp();
    storePendingVerification(pendingSignupData.email, otp, { type: "signup" });
    document.getElementById("signup-otp-display").textContent = otp;
    clearOtpBoxes("signup-otp-boxes");
    startResendCooldown("signup-resend-btn", "signup-resend-timer");
    showToast("New code generated!", "info");
  });

  // Back button (signup verification → form)
  document.getElementById("signup-back-btn")?.addEventListener("click", () => {
    signupStepVerify.classList.add("hidden");
    signupStepForm.classList.remove("hidden");
  });

  // ─── LOGIN FLOW ───────────────────────────────────────────────────────────
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const email    = document.getElementById("login-email").value.trim().toLowerCase();
      const password = document.getElementById("login-password").value;
      let valid = true;

      if (!email) {
        showError("login-email", "login-email-error", "Email is required");
        valid = false;
      }
      if (!password) {
        showError("login-password", "login-password-error", "Password is required");
        valid = false;
      }
      if (!valid) return;

      const user = getUsers().find((u) => u.email === email && u.password === password);
      if (!user) {
        showError("login-email",    "login-email-error",    "Invalid email or password");
        showError("login-password", "login-password-error", "Invalid email or password");
        showToast("Invalid email or password", "error");
        return;
      }

      const session = { userId: user.id, email: user.email, loginAt: new Date().toISOString() };
      const remember = document.getElementById("remember-me")?.checked;
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));

      showToast(`Welcome ${user.fullName}!`);
      window.setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
    });
  }

  // ─── FORGOT PASSWORD FLOW ─────────────────────────────────────────────────
  const fpEmailForm  = document.getElementById("fp-email-form");
  const fpResetForm  = document.getElementById("fp-reset-form");
  const fpStepEmail  = document.getElementById("fp-step-email");
  const fpStepVerify = document.getElementById("fp-step-verify");

  let fpTargetEmail = null;

  // Wire strength meter for forgot-password new-password field
  attachStrengthMeter("fp-new-password", "fp-password-strength", "fp-pw-checklist");

  if (fpEmailForm) {
    fpEmailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const email  = document.getElementById("fp-email").value.trim().toLowerCase();
      const users  = getUsers();

      if (!isValidEmail(email)) {
        showError("fp-email", "fp-email-error", "Please enter a valid email address");
        return;
      }

      // Intentionally vague message: don't reveal whether email exists
      const userExists = users.some((u) => u.email === email);
      if (!userExists) {
        // Show success UI anyway (security best practice — don't leak user existence)
        showFpVerifyStep(email, null);
        return;
      }

      const otp = generateOtp();
      storePendingVerification(email, otp, { type: "reset" });
      fpTargetEmail = email;
      showFpVerifyStep(email, otp);
    });
  }

  function showFpVerifyStep(email, otp) {
    fpStepEmail?.classList.add("hidden");
    fpStepVerify?.classList.remove("hidden");

    const bannerEmail = document.getElementById("fp-banner-email");
    const otpDisplay  = document.getElementById("fp-otp-display");
    if (bannerEmail) bannerEmail.textContent = email;
    if (otpDisplay)  otpDisplay.textContent  = otp ?? "— account not found —";

    initOtpBoxes("fp-otp-boxes");
    document.querySelector("#fp-otp-boxes .otp-box")?.focus();
    startResendCooldown("fp-resend-btn", "fp-resend-timer");

    showToast(otp ? "Reset code generated!" : "If this email exists, a code was sent.", "info");
  }

  if (fpResetForm) {
    fpResetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const entered         = getOtpValue("fp-otp-boxes");
      const newPassword     = document.getElementById("fp-new-password").value;
      const confirmPassword = document.getElementById("fp-confirm-password").value;
      const email           = fpTargetEmail;
      const record          = email ? getPendingVerification(email) : null;

      // OTP validation
      if (!record) {
        document.getElementById("fp-otp-error").textContent = "Session expired. Please start over.";
        return;
      }
      if (Date.now() - record.createdAt > OTP_TTL_MS) {
        clearPendingVerification(email);
        document.getElementById("fp-otp-error").textContent = "Code expired. Please request a new one.";
        return;
      }
      if (entered !== record.otp) {
        document.getElementById("fp-otp-error").textContent = "Incorrect code. Please try again.";
        clearOtpBoxes("fp-otp-boxes");
        return;
      }

      // Password validation
      if (!passwordMeetsRequirements(newPassword)) {
        document.getElementById("fp-new-password-error").textContent =
          "Password must be at least 8 chars with a letter and a number";
        return;
      }
      if (newPassword !== confirmPassword) {
        document.getElementById("fp-confirm-error").textContent = "Passwords do not match";
        return;
      }

      // ✅ Update password
      const users    = getUsers();
      const userIdx  = users.findIndex((u) => u.email === email);
      if (userIdx >= 0) {
        users[userIdx].password = newPassword;
        saveUsers(users);
      }
      clearPendingVerification(email);

      showToast("Password updated! Redirecting to login…");
      window.setTimeout(() => { window.location.href = "index.html"; }, 1600);
    });
  }

  // Resend OTP (forgot-password)
  document.getElementById("fp-resend-btn")?.addEventListener("click", () => {
    if (!fpTargetEmail) return;
    const otp = generateOtp();
    storePendingVerification(fpTargetEmail, otp, { type: "reset" });
    const otpDisplay = document.getElementById("fp-otp-display");
    if (otpDisplay) otpDisplay.textContent = otp;
    clearOtpBoxes("fp-otp-boxes");
    startResendCooldown("fp-resend-btn", "fp-resend-timer");
    showToast("New reset code generated!", "info");
  });
});
