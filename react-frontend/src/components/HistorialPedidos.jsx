import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

function HistorialPedidos() {
  const { user } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/cliente/historial/${user.id_usuario}`)
      .then(res => res.json())
      .then(data => setHistorial(data))
      .catch(err => console.error("Error cargando historial:", err));
  }, [user]);

  return (
    <div>
      <h3>Historial de pedidos</h3>
      {historial.length === 0 ? (
        <p>No tienes pedidos anteriores</p>
      ) : (
        <ul>
          {historial.map(p => (
            <li key={p.id_pedido}>
              Pedido #{p.id_pedido} - Estado: {p.estado} - Fecha: {p.fecha}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistorialPedidos;
