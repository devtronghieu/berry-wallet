import { createCipheriv, createDecipheriv, createHash, pbkdf2Sync, randomBytes } from "crypto";

const iv = randomBytes(16);
const salt = randomBytes(16);
const keyLength = 32;
const iterations = 1000;

export interface EncryptedData {
  encrypted: string;
  iv: Buffer;
  salt: Buffer;
}

export const encryptWithPassword = (data: string, password: string): EncryptedData => {
  const key = pbkdf2Sync(password, salt, iterations, keyLength, "sha512");
  const cipher = createCipheriv("aes-256-ctr", key, iv);
  const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
  return { encrypted, iv, salt };
};

export const decryptWithPassword = (encryptedData: EncryptedData, password: string) => {
  const { encrypted, iv, salt } = encryptedData;
  const key = pbkdf2Sync(password, salt, iterations, keyLength, "sha512");
  const decipher = createDecipheriv("aes-256-ctr", key, iv);
  const decrypted = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
};

export const hash = (data: string) => {
  return createHash("sha256").update(data).digest("hex");
};
