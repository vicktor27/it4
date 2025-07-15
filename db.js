import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://ut4_user:5kFDqGiCcOQVps1xrYmxVNDJPB7SXjEA@dpg-d1rap56uk2gs739ogt60-a.oregon-postgres.render.com/ut4",
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
