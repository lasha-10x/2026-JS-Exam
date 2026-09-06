import { test } from "node:test";
import assert from "node:assert/strict";
import { mapApiUserToClient } from "../js/data.js";

test("mapApiUserToClient builds the Client shape from a DummyJSON user", () => {
  const apiUser = {
    id: 1,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@x.dummyjson.com",
    phone: "+81 965-431-3024",
    company: { name: "Dooley, Kozey and Cronin" },
    image: "https://dummyjson.com/icon/emilys/128",
  };

  const client = mapApiUserToClient(apiUser);

  assert.equal(client.id, 1);
  assert.equal(client.name, "Emily Johnson");
  assert.equal(client.email, "emily.johnson@x.dummyjson.com");
  assert.equal(client.phone, "+81 965-431-3024");
  assert.equal(client.company, "Dooley, Kozey and Cronin");
  assert.equal(client.image, "https://dummyjson.com/icon/emilys/128");
  assert.equal(client.status, "Lead");
  assert.ok(client.dealValue >= 500 && client.dealValue <= 10000);
  assert.deepEqual(client.notes, []);
  assert.ok(typeof client.createdAt === "string" && client.createdAt.length > 0);
});

test("mapApiUserToClient falls back to an empty company when none is given", () => {
  const apiUser = {
    id: 2,
    firstName: "Ana",
    lastName: "Kldiashvili",
    email: "ana@example.com",
    phone: "",
    company: null,
    image: "",
  };

  const client = mapApiUserToClient(apiUser);

  assert.equal(client.company, "");
});
