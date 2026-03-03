import pg from "pg";
const { Pool } = pg;

const globalForPg = globalThis;

if (!globalForPg.__pgPool) {
  globalForPg.__pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Força criptografia (resolve "no encryption")
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,

    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

export async function query(text, params) {
  return globalForPg.__pgPool.query(text, params);
}

export default { query };
