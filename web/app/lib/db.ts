import { Pool } from "pg";

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE_NAME,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });
  }
  return pool;
}

export async function query(text: string, params: any[]) {
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return { data: result, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function getClient() {
  return getPool().connect();
}
