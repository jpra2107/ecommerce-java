const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===================== LOGIN =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email=? AND password=?",
      [email, password]
    );
    if (rows.length > 0) {
      const usuario = rows[0];
      res.json({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
});

// ===================== DASHBOARD =====================

// Dashboard general
router.get("/dashboard", async (req, res) => {
  try {
    const [ventas] = await pool.query(
      "SELECT SUM(monto) AS ventasMes FROM facturas WHERE MONTH(fecha) = MONTH(CURDATE())"
    );
    const [pedidosPendientes] = await pool.query(
      "SELECT COUNT(*) AS pedidosPendientes FROM pedidos WHERE estado = 'pendiente'"
    );
    const [stockBajo] = await pool.query(
      "SELECT COUNT(*) AS stockBajo FROM productos WHERE stock < 5"
    );
    const [clientesActivos] = await pool.query(
      "SELECT COUNT(DISTINCT id_cliente) AS clientesActivos FROM pedidos WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)"
    );

    res.json({
      ventasMes: ventas[0].ventasMes || 0,
      pedidosPendientes: pedidosPendientes[0].pedidosPendientes || 0,
      stockBajo: stockBajo[0].stockBajo || 0,
      clientesActivos: clientesActivos[0].clientesActivos || 0,
    });
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
      SELECT pr.nombre AS nombre, SUM(pd.cantidad) AS total_vendidos
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

// ===================== CRUD USUARIOS =====================

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear usuario
router.post("/usuarios", async (req, res) => {
  const { nombre, email, rol, password } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, rol, password) VALUES (?, ?, ?, ?)",
      [nombre, email, rol, password]
    );
    res.json({ id_usuario: result.insertId, nombre, email, rol });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Editar usuario
router.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;
  try {
    await pool.query(
      "UPDATE usuarios SET nombre=?, email=?, rol=? WHERE id_usuario=?",
      [nombre, email, rol, id]
    );
    res.json({ id_usuario: id, nombre, email, rol });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Borrar usuario
router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id_usuario=?", [id]);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar usuario" });
  }
});

module.exports = router;


