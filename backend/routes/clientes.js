const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ver historial de pedidos
router.get("/historial/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pedidos WHERE id_cliente = ? ORDER BY fecha DESC",
      [id_cliente]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// Calificar pedido
router.post("/calificar", async (req, res) => {
  const { id_pedido, puntuacion, comentario } = req.body;
  try {
    await pool.query(
      "INSERT INTO calificaciones (id_pedido, puntuacion, comentario) VALUES (?,?,?)",
      [id_pedido, puntuacion, comentario]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al calificar" });
  }
});

// Obtener productos disponibles
router.get("/productos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_producto, nombre, precio, stock FROM productos"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Crear pedido en curso
router.post("/pedido", async (req, res) => {
  const { id_cliente, productos, metodo_pago } = req.body;
  try {
    const [pedido] = await pool.query(
      "INSERT INTO pedidos (id_cliente, estado, fecha, metodo_pago) VALUES (?, 'pendiente', NOW(), ?)",
      [id_cliente, metodo_pago]
    );

    for (const p of productos) {
      await pool.query(
        "INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?,?,?,?)",
        [pedido.insertId, p.id_producto, p.cantidad, p.precio]
      );
    }

    res.json({ success: true, id_pedido: pedido.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear pedido" });
  }
});

module.exports = router;
