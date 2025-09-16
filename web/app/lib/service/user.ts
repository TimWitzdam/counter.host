import { getClient, query } from "@/app/lib/db";
import { SecurityService } from "./security";
import crypto from "crypto";

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
    const verificationToken = await SecurityService.generateVerifyEmailToken();

    await client.query(
      `INSERT INTO "email_verification"(token, user_id) 
       VALUES ($1, $2);`,
      [verificationToken, userId]
    );

    const sessionCookie = crypto.randomUUID();

    await client.query(
      `INSERT INTO "session"(id, user_id) 
       VALUES ($1, $2);`,
      [sessionCookie, userId]
    );

    await client.query("COMMIT");
    client.release();

    return [verificationToken, sessionCookie];
  }

  static async verify(token: string, sessionCookie: string) {
    const client = await getClient();
    await client.query("BEGIN");

    let sessionResult;
    let tokenResult;
    try {
      sessionResult = await client.query(
        `SELECT user_id 
      FROM "session"
      WHERE id = $1`,
        [sessionCookie]
      );

      tokenResult = await client.query(
        `SELECT user_id 
        FROM "email_verification"
        WHERE token = $1
        AND verified_at IS NULL`,
        [token]
      );
    } catch (e) {
      return null;
    }

    if (sessionResult.rowCount === 0 || tokenResult.rowCount === 0) {
      return null;
    }

    const sessionUser = sessionResult.rows[0].user_id;
    const tokenUser = tokenResult.rows[0].user_id;

    if (sessionUser !== tokenUser) {
      return null;
    }

    await client.query(
      `UPDATE "email_verification"
        SET verified_at = NOW()
        WHERE token = $1`,
      [token]
    );

    await client.query("COMMIT");
    client.release();

    return tokenUser;
  }

  static async getUser(id: string) {
    const res = await query(
      `SELECT name, email, created_at
      FROM "user"
      WHERE id = $1`,
      [id]
    );

    if (res.error) {
      return null;
    }

    if (!res.data || res.data.rowCount === 0) {
      return null;
    }

    const row = res.data.rows[0];

    const decryptedEmail = SecurityService.decrypt(row.email);

    return {
      name: row.name,
      email: decryptedEmail,
      createdAt: row.created_at,
    };
  }
}
