// pages/api/v1/status.js
import database from "infra/database";

export default async function status(req, res) {
  try {
    const updatedAT = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersion = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    // seu banco do Aiven é "defaultdb"
    const databaseName = process.env.POSTGRES_DB ?? "defaultdb";

    const databaseOpenedConnectionsResult = await database.query({
      text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
      values: [databaseName],
    });

    res.status(200).json({
      updated_at: updatedAT,
      dependencies: {
        database: {
          version: databaseVersion,
          max_connections: parseInt(databaseMaxConnectionsValue, 10),
          opened_connections: databaseOpenedConnectionsResult.rows[0].count,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
      code: err?.code,
    });
  }
}
