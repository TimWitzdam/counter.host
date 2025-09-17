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
    } catch (e) {
      client.release();
      return null;
    }

    if (sessionResult.rowCount === 0) {
      client.release();
      return null;
    }

    const userId = sessionResult.rows[0].user_id;

    try {
      tokenResult = await client.query(
        `SELECT user_id 
        FROM "email_verification"
        WHERE token = $1
        AND verified_at IS NULL
        AND user_id = $2`,
        [token, userId]
      );
    } catch (e) {
      client.release();
      return null;
    }

    if (tokenResult.rowCount === 0) {
      client.release();
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

    return userId;
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

  static async authenticate(email: string, password: string) {
    const client = await getClient();
    await client.query("BEGIN");

    const hashedEmail = SecurityService.deterministicHash(email);

    let userResult;
    try {
      userResult = await client.query(
        `SELECT u.id, u.password, ev.verified_at
        FROM "user" AS u
        LEFT JOIN email_verification AS ev
          ON u.id = ev.user_id
        WHERE u.hashed_email = $1;`,
        [hashedEmail]
      );
    } catch (e) {
      client.release();
      return;
    }

    if (userResult.rowCount === 0) {
      client.release();
      return;
    }

    const user = userResult.rows[0];

    try {
      if (await SecurityService.verifyHash(user.password, password)) {
        const isVerified = user.verified_at ? true : false;
        return [user.id, isVerified];
      } else {
        return;
      }
    } catch (err) {
      return;
    } finally {
      client.release();
    }
  }

  static async newSession(userId: string) {
    const sessionCookie = crypto.randomUUID();

    const client = await getClient();
    await client.query("BEGIN");

    try {
      await client.query(
        `INSERT INTO "session"(id, user_id) 
       VALUES ($1, $2);`,
        [sessionCookie, userId]
      );
      await client.query("COMMIT");

      return sessionCookie;
    } catch (e) {
      await client.query("ROLLBACK");
      return;
    } finally {
      client.release();
    }
  }

  static async validateSession(sessionCookie: string) {
    const client = await getClient();
    await client.query("BEGIN");

    let verifiedResult;
    try {
      verifiedResult = await client.query(
        `SELECT
        ev.verified_at
        FROM session AS s
        LEFT JOIN "user" AS u ON u.id = s.user_id
        LEFT JOIN email_verification AS ev ON u.id = ev.user_id
        WHERE s.id = $1;`,
        [sessionCookie]
      );
    } catch (e) {
      client.release();
      return;
    }

    if (verifiedResult.rowCount === 0) {
      client.release();
      return;
    }

    try {
      await client.query(
        `UPDATE "session"
        SET last_used = NOW()
        WHERE id = $1`,
        [sessionCookie]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      return;
    } finally {
      client.release();
    }

    const verifiedAt = verifiedResult.rows[0];

    const isVerified = verifiedAt.verified_at ? true : false;
    return isVerified;
  }
}
