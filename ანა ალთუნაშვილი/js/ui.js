/**
 * ui.js
 * ---------------------------------------------------------------------------
 * Small rendering helpers shared across Clients, Dashboard, and Profile —
 * pulled into one file for the same reason storage.js and validation.js
 * exist: three pages independently reinventing "how do we show a status
 * badge" is exactly the copy-paste the PRD tells us to avoid.
 * ---------------------------------------------------------------------------
 */

const STATUS_BADGE_CLASS = {
  Lead: 'badge-lead',
  Contacted: 'badge-contacted',
  Won: 'badge-won',
  Lost: 'badge-lost',
};

const STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];

// Escapes the 5 characters that have special meaning in HTML, so any text
// a user typed (a client's name, a note, etc.) is always displayed exactly
// as typed — never interpreted as a tag or script, even if it looks like one.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function statusBadgeHtml(status) {
  const cls = STATUS_BADGE_CLASS[status] || 'badge-lead';
  return `<span class="badge ${cls}">${status}</span>`;
}

// Returns an <img> if the client has a real photo, otherwise a colored
// initials circle. sizeClass lets callers ask for a bigger/smaller version
// (e.g. "avatar-sm" in dashboard rows, "avatar-lg" in the details modal).
function avatarHtml(name, imageUrl, sizeClass = '') {
  const safeName = escapeHtml(name);
  if (imageUrl) {
    return `<img class="client-avatar ${sizeClass}" src="${imageUrl}" alt="${safeName}" />`;
  }
  return `<div class="client-avatar-initials ${sizeClass}">${escapeHtml(getInitials(name))}</div>`;
}
