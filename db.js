import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString:
    "postgresql://iot_db_gei0_user:axQ8NG24jzrS4tbsTlZgMd3GozEZOLzf@dpg-d0rmjhjipnbc73efv7sg-a.oregon-postgres.render.com/iot_db_gei0",
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
