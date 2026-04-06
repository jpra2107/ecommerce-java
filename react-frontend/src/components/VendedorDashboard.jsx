import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "./VendedorDashboard.css";

function VendedorDashboard() {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [mes, setMes] = useState("");
  const [vista, setVista] = useState("asignados");
  const [stats, setStats] = useState({ total: 0, completados: 0, ingresos: 0 });

  useEffect(() => {
    if (user && user.id_usuario) {
      cargarPedidos();
      cargarStats();
    }
  }, [user, mes, vista]);

  const cargarPedidos = () => {
    if (!user || !user.id_usuario) return;
    let url = `http://localhost:3001/vendedor/pedidos/${user.id_usuario}`;
    if (mes) url += `?mes=${mes}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error cargando pedidos:", err));
  };

  const cargarStats = () => {
    if (!user || !user.id_usuario) return;
    fetch(`http://localhost:3001/vendedor/stats/${user.id_usuario}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));
  };

  const cambiarPrioridad = (id_pedido, nuevaPrioridad) => {
    fetch(`http://localhost:3001/vendedor/prioridad/${id_pedido}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prioridad: nuevaPrioridad }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Prioridad actualizada");
          cargarPedidos();
        }
      })
      .catch((err) => console.error("Error cambiando prioridad:", err));
  };

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  return (
    <div className="vendedor-dashboard">
      <header className="topbar">
        <h2>Bienvenido, {user?.nombre || "Vendedor"}</h2>
      </header>

      <section className="acciones">
        <button onClick={() => setVista("asignados")}>Pedidos en curso</button>
        <button onClick={() => setVista("historico")}>Histórico</button>
        <button onClick={() => setVista("stats")}>Estadísticas</button>
      </section>

      {vista === "stats" && (
        <section className="estadisticas">
          <h3>Estadísticas rápidas</h3>
          <p>Total pedidos asignados: {stats.total}</p>
          <p>Pedidos completados este mes: {stats.completados}</p>
          <p>Ingresos generados: ${stats.ingresos}</p>
        </section>
      )}

      {vista === "historico" && (
        <>
          <section className="filtro">
            <label>Filtrar por mes:</label>
            <select value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="">Todos</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </section>

          <section className="tabla-pedidos">
            <h3>Histórico de pedidos</h3>
            <table>
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>ID Cliente</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Prioridad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr><td colSpan="6">No hay pedidos</td></tr>
                ) : (
                  pedidos.map((p) => (
                    <tr key={p.id_pedido}>
                      <td>{p.id_pedido}</td>
                      <td>{p.id_cliente}</td>
                      <td>{p.estado}</td>
                      <td>{new Date(p.fecha).toLocaleDateString()}</td>
                      <td>{p.prioridad}</td>
                      <td>
                        <select
                          value={p.prioridad}
                          onChange={(e) => cambiarPrioridad(p.id_pedido, e.target.value)}
                        >
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </>
      )}

      {vista === "asignados" && (
        <section className="tabla-pedidos">
          <h3>Pedidos en curso</h3>
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>ID Cliente</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr><td colSpan="5">No hay pedidos en curso</td></tr>
              ) : (
                pedidos
                  .filter((p) => p.estado !== "Entregado")
                  .map((p) => (
                    <tr key={p.id_pedido}>
                      <td>{p.id_pedido}</td>
                      <td>{p.id_cliente}</td>
                      <td>{p.estado}</td>
                      <td>{new Date(p.fecha).toLocaleDateString()}</td>
                      <td>{p.prioridad}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default VendedorDashboard;

