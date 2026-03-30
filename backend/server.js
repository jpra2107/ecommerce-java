const express = require("express");
const cors = require("cors");
const pool = require("./db");

const clienteRoutes = require("./routes/cliente");
const vendedorRoutes = require("./routes/vendedor");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const app = express(); // ⚠️ primero se crea la app

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/", authRoutes);

// Rutas por rol
app.use("/cliente", clienteRoutes);
app.use("/vendedor", vendedorRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
