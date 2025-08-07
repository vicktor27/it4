import pool from "./db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto en http://localhost:${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error.message);
});

dotenv.config();
app.use(cors());
app.use(express.json());

app.post("/create-data-table", async (req, res) => {
  const tableName = "device_logs";
  try {
    const checkTable = await pool.query(
      `SELECT to_regclass($1)::text AS exists`,
      [`public.${tableName}`]
    );

    if (!checkTable.rows[0].exists) {
      await pool.query(`
        CREATE TABLE device_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(50) NOT NULL,
        "user" TEXT NOT NULL,
        enroll_id TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
      `);

      return res.status(201).json({ message: "✅ Tabla creada exitosamente" });
    }
    return res.status(200).json({ message: "ℹ La tabla ya existe" });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.post("/turn-on", async (req, res) => {
  const { user, enrollId } = req.body;
  const deviceStatus = {};
  deviceStatus.isOn = true;

  try {
    await pool.query(
      `INSERT INTO device_logs (action, "user", enroll_id) VALUES ($1, $2, $3)`,
      ["turn-on", user, enrollId]
    );

    return res.json({
      message: "Dispositivo encendido",
      status: deviceStatus,
    });
  } catch (err) {
    console.error("Error al guardar log:", err);
    return res.status(500).json({ error: "Error al guardar log" });
  }
});

app.post("/save-data", async (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: "El campo 'value' es requerido" });
  }
  const tableName = "data";
  try {
    const result = await pool.query(
      `INSERT INTO ${tableName} (value) VALUES ($1) RETURNING *`,
      [value]
    );

    return res.status(201).json({
      message: "✅ Datos guardados exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ error: "Error al guardar los datos" });
  }
});

app.post("/drop-data-table", async (req, res) => {
  try {
    const tableName = "data";

    await pool.query(`DROP TABLE IF EXISTS ${tableName}`);

    return res.status(200).json({ message: "✅ Tabla eliminada exitosamente" });
  } catch (err) {
    //console.error("❌ Error:", error.message);
    return res.status(500).json({ error: "Error al eliminar la tabla" });
  }
});

app.get("/get-data", async (req, res) => {
  try {
    const tableName = "data";
    const result = await pool.query(`SELECT * FROM  ${tableName}`);

    //  console.log(result.rows());
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Imposible Regresar los datos" });
  }
});

/*
app.get("/temperatura"),
  async (req, res) => {
    try {
      res.json({ valor: "10 °C", timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("❌ Error:", error.message);
      return res.status(500).json({ error: "Error al obtener temperatura" });
    }
  };
*/
