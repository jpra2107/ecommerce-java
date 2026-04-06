import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState("");   // <-- define email
  const [password, setPassword] = useState(""); // <-- define password
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // usa los estados
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.rol === "admin") navigate("/admin");
        else if (data.rol === "vendedor") navigate("/vendedor");
        else navigate("/cliente");
      } else {
        alert("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Pantalla de Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;




