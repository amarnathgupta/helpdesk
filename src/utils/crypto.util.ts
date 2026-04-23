import crypto from "crypto";
import env from "../config/env";
import ApiError from "./apiError";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(env.ENCRYPTION_KEY as string, "hex"); // must be 32 bytes
const IV_LENGTH = 12; // recommended for GCM

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // store iv + authTag + encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (encryptedText: string) => {
  const parts = encryptedText.split(":");

  if (parts.length !== 3) {
    throw new ApiError("Invalid encrypted text format", 400);
  }

  const [ivHex, tagHex, contentHex] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(contentHex, "hex");

  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    throw new ApiError("Decryption failed or data corrupted", 500);
  }
};
