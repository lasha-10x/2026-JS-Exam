/**
 * utils.js
 */

function formatCurrency(amount) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

function initialsFromName(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}