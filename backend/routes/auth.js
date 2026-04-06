const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db"); // conexión MySQL

router.post("/login", async (req, res) => {
  const { username, password } = req.body; // username = columna "nombre"

  try {
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, email, rol, password FROM usuarios WHERE nombre = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Si tus contraseñas están encriptadas con bcrypt:
    // const validPassword = await bcrypt.compare(password, usuario.password);

    // Si tus contraseñas están planas (ej: "a1234"), usa:
    const validPassword = password === usuario.password;

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json({
      id: usuario.id_usuario,
      username: usuario.nombre,
      email: usuario.email,
      role: usuario.rol,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;

