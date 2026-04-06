const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ver pedidos asignados a un vendedor con filtro opcional por mes
router.get("/pedidos/:idVendedor", (req, res) => {
  const idVendedor = req.params.idVendedor;
  const { mes } = req.query; // mes opcional

  let sql =
    "SELECT id_pedido, id_cliente, fecha, estado, prioridad FROM pedidos WHERE id_vendedor = ?";
  let params = [idVendedor];

  if (mes) {
    sql += " AND MONTH(fecha) = ?";
    params.push(mes);
  }

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Cambiar prioridad de un pedido
router.put("/prioridad/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;
  const { prioridad } = req.body;
  try {
    await pool.query("UPDATE pedidos SET prioridad = ? WHERE id_pedido = ?", [
      prioridad,
      id_pedido,
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar prioridad" });
  }
});

// Estadísticas rápidas del vendedor
router.get("/stats/:idVendedor", async (req, res) => {
  const { idVendedor } = req.params;
  try {
    // Total de pedidos asignados
    const [totalPedidos] = await pool.query(
      "SELECT COUNT(*) AS total FROM pedidos WHERE id_vendedor = ?",
      [idVendedor]
    );

    // Pedidos completados este mes
    const [completadosMes] = await pool.query(
      "SELECT COUNT(*) AS completados FROM pedidos WHERE id_vendedor = ? AND estado = 'Entregado' AND MONTH(fecha) = MONTH(CURDATE())",
      [idVendedor]
    );

    // Ingresos generados
    const [ingresos] = await pool.query(
      `SELECT SUM(pd.cantidad * pd.precio_unitario) AS ingresos
       FROM pedidos p
       JOIN pedidos_detalle pd ON p.id_pedido = pd.id_pedido
       WHERE p.id_vendedor = ? AND p.estado = 'Entregado'`,
      [idVendedor]
    );

    res.json({
      total: totalPedidos[0].total || 0,
      completados: completadosMes[0].completados || 0,
      ingresos: ingresos[0].ingresos || 0,
    });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

module.exports = router;

