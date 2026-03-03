import pg from "pg";
const { Pool } = pg;

const globalForPg = globalThis;

if (!globalForPg.__pgPool) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing env var: DATABASE_URL");
  }

  globalForPg.__pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Aiven exige TLS. Na Vercel, force SSL:
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
