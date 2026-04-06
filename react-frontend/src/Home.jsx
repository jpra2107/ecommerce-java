import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a E-Commerce App</h1>
      <p>Selecciona tu rol:</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/admin">Administrador</Link>
        <Link to="/vendedor">Vendedor</Link>
        <Link to="/cliente">Cliente</Link>
      </div>
    </div>
  );
}

export default Home;
