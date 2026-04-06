const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const clienteRoutes = require("./routes/clientes");
const vendedorRoutes = require("./routes/vendedor");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use("/cliente", clienteRoutes);
app.use("/admin", adminRoutes);
app.use("/vendedor", vendedorRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
