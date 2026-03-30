const express = require("express");
const router = express.Router();
const pool = require("../db");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      res.json({ success: true, role: usuario.rol, id: usuario.id_usuario });
    } else {
      res.json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
