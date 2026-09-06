import { test } from "node:test";
import assert from "node:assert/strict";
import { UI } from "../js/ui.js";

test("formatCurrency turns a number into a $-prefixed, comma-grouped string", () => {
  assert.equal(UI.formatCurrency(5000), "$5,000");
  assert.equal(UI.formatCurrency(0), "$0");
  assert.equal(UI.formatCurrency(1234567), "$1,234,567");
});

test("getInitials takes the first letter of the first and last name", () => {
  assert.equal(UI.getInitials("Emily Johnson"), "EJ");
  assert.equal(UI.getInitials("Madonna"), "M");
  assert.equal(UI.getInitials("Ana Maria Kldiashvili"), "AK");
});
