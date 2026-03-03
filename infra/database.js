// infra/database.js
import pg from "pg";
const { Pool } = pg;

const globalForPg = globalThis;

if (!globalForPg.__pgPool) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing env var: DATABASE_URL");
  }

  globalForPg.__pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // FORÇA TLS SEMPRE (resolve "no encryption" no Aiven)
    ssl: { rejectUnauthorized: false },

    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  // (opcional) pra você confirmar no log da Vercel
  console.log(
    "DB pool created. SSL enabled:",
    !!globalForPg.__pgPool.options.ssl,
  );
}

export async function query(text, params) {
  return globalForPg.__pgPool.query(text, params);
}

export default { query };
