import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://db2_4znq_user:sJV2uhshkl3c0pTX3OdoHWjDlO28JqLW@dpg-d2hlbmripnbc73eni3c0-a.oregon-postgres.render.com/db2_4znq",
  ssl: { rejectUnauthorized: true },
});

export default pool;

async function testConection() {
  try {
    const client = await pool.connect();
    console.log("Connection Successful");
    client.release();
    await pool.end();
  } catch (err) {
    console.err("Error to connect", err);
  }
}
//testConection();
