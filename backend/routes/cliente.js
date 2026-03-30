const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ver historial de pedidos
router.get("/historial/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pedidos WHERE id_cliente = ?",
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

module.exports = router;
