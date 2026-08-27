import assert from "node:assert/strict";
// Focused unit tests for validation and API-to-client mapping helpers.
import test from "node:test";

import { getPasswordStrength, isValidEmail, isValidPassword } from "../js/core/utils.js";
import { isLocalClient, mapApiUserToClient } from "../js/core/data.js";

test("isValidEmail accepts a valid address", () => {
  assert.equal(isValidEmail("pavel@example.com"), true);
});

test("isValidEmail rejects incomplete addresses", () => {
  assert.equal(isValidEmail("pavel@example"), false);
  assert.equal(isValidEmail("pavel.example.com"), false);
});

test("isValidPassword requires a letter, a number, and eight characters", () => {
  assert.equal(isValidPassword("demo1234"), true);
  assert.equal(isValidPassword("onlyletters"), false);
  assert.equal(isValidPassword("12345678"), false);
  assert.equal(isValidPassword("abc123"), false);
});

test("getPasswordStrength reports weak, medium, and strong passwords", () => {
  assert.deepEqual(getPasswordStrength(""), { score: 0, level: "empty" });
  assert.equal(getPasswordStrength("short").level, "weak");
  assert.equal(getPasswordStrength("demo1234").level, "medium");
  assert.equal(getPasswordStrength("Strong#Pass123").level, "strong");
});

test("mapApiUserToClient creates the required CRM client shape", () => {
  const client = mapApiUserToClient(
    { id: 5, firstName: "Emily", lastName: "Johnson", email: "emily@example.com", phone: "+1 555", company: { name: "Example Inc" }, image: "avatar.png" },
    2
  );

  assert.deepEqual(Object.keys(client), ["id", "name", "email", "phone", "company", "image", "status", "dealValue", "notes", "createdAt"]);
  assert.equal(client.name, "Emily Johnson");
  assert.equal(client.status, "Lead");
  assert.equal(client.dealValue, 1700);
  assert.deepEqual(client.notes, []);
});

test("isLocalClient recognizes current and legacy browser-created clients", () => {
  assert.equal(isLocalClient({ source: "local", image: "avatar.png" }), true);
  assert.equal(isLocalClient({ image: "" }), true);
  assert.equal(isLocalClient({ image: "https://example.com/avatar.png" }), false);
});
