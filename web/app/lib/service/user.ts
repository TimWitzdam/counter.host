import { getClient } from "@/app/lib/db";
import { SecurityService } from "./security";

export class UserService {
  static async create(
    name: string,
    hashedMail: string,
    encryptedMail: string,
    hashedPassword: string
  ) {
    const client = await getClient();
    await client.query("BEGIN");

    let insertUserRes;
    try {
      insertUserRes = await client.query(
        `INSERT INTO "user"(name, email, hashed_email, password) 
       VALUES ($1, $2, $3, $4) RETURNING id;`,
        [name, encryptedMail, hashedMail, hashedPassword]
      );
    } catch (e) {
      await client.query("ROLLBACK");
      client.release();

      return null;
    }

    const userId = insertUserRes.rows[0].id;
    const verificationToken = SecurityService.generateVerifyEmailToken();

    await client.query(
      `INSERT INTO "email_verification"(token, user_id) 
       VALUES ($1, $2);`,
      [verificationToken, userId]
    );

    await client.query("COMMIT");
    client.release();

    return verificationToken;
  }
}
