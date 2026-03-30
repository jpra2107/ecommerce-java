const express = require("express");
const router = express.Router();
const pool = require("../db");

// Dashboard general
router.get("/dashboard", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT SUM(monto) AS totalVentas, COUNT(*) AS totalPedidos
      FROM facturas
    `);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener dashboard" });
  }
});

// Ventas mensuales
router.get("/ventas-mensuales", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT MONTH(fecha) AS mes, SUM(monto) AS total
      FROM facturas
      GROUP BY MONTH(fecha)
      ORDER BY mes
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas mensuales" });
  }
});

// Productos más vendidos
router.get("/productos-mas-vendidos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.nombre, SUM(pd.cantidad) AS total_vendidos
      FROM pedidos_detalle pd
      JOIN productos pr ON pd.id_producto = pr.id_producto
      GROUP BY pr.nombre
      ORDER BY total_vendidos DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
});

module.exports = router;
