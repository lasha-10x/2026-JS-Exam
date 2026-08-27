// Shared utility functions for formatting, ID generation, audio synthesis, and requests

import { MIN_DEAL_VALUE, MAX_DEAL_VALUE, TOAST_DURATION_MS } from "./config.js";

let toastTimerId = null;

export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function generateUniqueId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.floor(Math.random() * 1000));
}

export function randomDealValue() {
  const range = MAX_DEAL_VALUE - MIN_DEAL_VALUE + 1;
  return Math.floor(Math.random() * range) + MIN_DEAL_VALUE;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function escapeCsvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function showToast(message, type = "success") {
  const toastEl = document.getElementById("toast");
  if (!toastEl) return;

  window.clearTimeout(toastTimerId);
  toastEl.textContent = message;
  toastEl.className = `${type} show`;
  toastTimerId = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, TOAST_DURATION_MS);
}

/**
 * Plays a two-tone chime notification sound using the Web Audio API.
 * Synthesizes audio dynamically in code without external sound files.
 */
export function playReminderSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // First note (E5 note ~ 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second note (A5 note ~ 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.5);
  } catch (error) {
    console.warn("Could not play reminder sound:", error);
  }
}

// phone input validation function
export function phoneInputValidation(input) {
  input.addEventListener("input", (e) => {
    let value = e.target.value;

    // Keep only digits, + and -
    value = value.replace(/[^\d+-]/g, "");

    // Allow only one + and only at the beginning
    value = value.replace(/(?!^)\+/g, "");

    e.target.value = value;
  });
}
