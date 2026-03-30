const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ver pedidos asignados a un vendedor
router.get('/pedidos/:idVendedor', (req, res) => {
  const idVendedor = req.params.idVendedor;
  const sql = 'SELECT id_pedido, id_cliente, fecha, estado, prioridad FROM pedidos WHERE id_vendedor = ?';
  
  pool.query(sql, [idVendedor], (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ error: err.message })
    }
    res.json(results);
  });
});

// Cambiar prioridad de un pedido
router.put("/prioridad/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;
  const { prioridad } = req.body;
  try {
    await pool.query(
      "UPDATE pedidos SET prioridad = ? WHERE id_pedido = ?",
      [prioridad, id_pedido]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar prioridad" });
  }
});

module.exports = router;
