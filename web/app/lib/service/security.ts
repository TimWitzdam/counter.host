import crypto from "crypto";
import * as argon2 from "argon2";

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET!;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export class SecurityService {
  static encrypt(text: string): string {
    const key = Buffer.from(ENCRYPTION_SECRET, "hex");
    if (key.length !== 32) {
      throw new Error(
        "Invalid key length. ENCRYPTION_SECRET must be a 32-byte hex string."
      );
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString("hex");
  }

  static decrypt(encryptedText: string): string {
    const key = Buffer.from(ENCRYPTION_SECRET, "hex");
    if (key.length !== 32) {
      throw new Error(
        "Invalid key length. ENCRYPTION_SECRET must be a 32-byte hex string."
      );
    }

    const data = Buffer.from(encryptedText, "hex");
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encryptedData = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    try {
      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);
      return decrypted.toString("utf8");
    } catch (err) {
      throw new Error("Failed to decrypt data: Authentication failed.");
    }
  }

  static deterministicHash(data: string) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  static async hash(data: string) {
    return await argon2.hash(data, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 2,
      parallelism: 1,
    });
  }

  static async verifyHash(hash: string, validData: string) {
    if (await argon2.verify(hash, validData)) {
      return true;
    } else {
      return false;
    }
  }

  static async generateVerifyEmailToken() {
    const length = 6;
    const charset = "0123456789";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charset.length;
      result += charset[randomIndex];
    }

    return result;
  }
}
