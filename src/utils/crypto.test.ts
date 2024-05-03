import { describe, expect, test } from "vitest";

import { decryptWithPassword, encryptWithPassword } from "./crypto";

describe("Encryption and decryption", () => {
  const data = "Hello, world!";
  const password = "supersecretpassword";

  test("Encrypt and decrypt data", () => {
    const encrypted = encryptWithPassword(data, password);
    const decrypted = decryptWithPassword(encrypted, password);
    expect(decrypted).toBe(data);
  });

  test("Decryption with incorrect password should fail", () => {
    const encrypted = encryptWithPassword(data, password);
    const decrypted = decryptWithPassword(encrypted, "wrongpassword");
    expect(decrypted).not.toBe(data);
  });
});
