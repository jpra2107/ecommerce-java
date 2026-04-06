import React, { useEffect, useState, useContext } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de datos, luego conectar al backend
    setDashboard({
      ventasMes: 120,
      pedidosPendientes: 15,
      stockBajo: 8,
      clientesActivos: 50,
    });

    setVentasMensuales([
      { mes: "Enero", total: 30 },
      { mes: "Febrero", total: 45 },
      { mes: "Marzo", total: 60 },
      { mes: "Abril", total: 80 },
    ]);

    setProductos([
      { nombre: "Producto A", total_vendidos: 40 },
      { nombre: "Producto B", total_vendidos: 25 },
      { nombre: "Producto C", total_vendidos: 15 },
      { nombre: "Producto D", total_vendidos: 10 },
    ]);

    // Cargar usuarios desde backend
    fetch("http://localhost:3001/admin/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error cargando usuarios:", err));
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Guardar cambios de configuración del admin
  const handleSaveConfig = async () => {
    try {
      const res = await fetch(`http://localhost:3001/admin/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        alert("Datos actualizados correctamente");
      }
    } catch (err) {
      console.error("Error actualizando admin:", err);
    }
  };

  // Crear nuevo usuario
  const handleCreateUser = async () => {
    const nuevo = { nombre: "Nuevo Usuario", email: "nuevo@email.com", rol: "cliente", password: "1234" };
    const res = await fetch("http://localhost:3001/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    if (res.ok) {
      const data = await res.json();
      setUsuarios([...usuarios, data]);
    }
  };

  // Editar usuario
  const handleEditUser = async () => {
    const res = await fetch(`http://localhost:3001/admin/usuarios/${editUser.id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    });
    if (res.ok) {
      alert("Usuario actualizado");
      setEditUser(null);
      const updated = usuarios.map(u => (u.id_usuario === editUser.id_usuario ? editUser : u));
      setUsuarios(updated);
    }
  };

  // Borrar usuario
  const handleDeleteUser = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/usuarios/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
    }
  };

  // Datos para gráficos
  const resumenData = {
    labels: ["Ventas del Mes", "Pedidos Pendientes", "Stock Bajo", "Clientes Activos"],
    datasets: [
      {
        label: "Resumen",
        data: [
          dashboard.ventasMes || 0,
          dashboard.pedidosPendientes || 0,
          dashboard.stockBajo || 0,
          dashboard.clientesActivos || 0,
        ],
        backgroundColor: ["#3b82f6", "#f97316", "#ef4444", "#22c55e"],
      },
    ],
  };

  const ventasMensualesData = {
    labels: ventasMensuales.map(v => v.mes),
    datasets: [
      {
        label: "Ventas por mes",
        data: ventasMensuales.map(v => v.total),
        borderColor: "#3b82f6",
        backgroundColor: "#93c5fd",
        fill: false,
      },
    ],
  };

  const productosData = {
    labels: productos.map(p => p.nombre),
    datasets: [
      {
        label: "Productos más vendidos",
        data: productos.map(p => p.total_vendidos),
        backgroundColor: ["#3b82f6", "#f97316", "#ef4444", "#22c55e"],
      },
    ],
  };

  return (
    <div className="panel-container admin-theme">
      <h2>Panel de Administrador 🚀</h2>

      {/* Botones principales */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleSaveConfig}>Configuración</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
        <button onClick={handleCreateUser}>Crear Usuario</button>
      </div>

      {/* Gráfico de resumen */}
      <div className="mb-6">
        <h3>Resumen General</h3>
        <Bar data={resumenData} />
      </div>

      {/* Gráfico de ventas mensuales */}
      <div className="mb-6">
        <h3>Ventas Mensuales</h3>
        <Line data={ventasMensualesData} />
      </div>

      {/* Gráfico de productos más vendidos */}
      <div className="mb-6">
        <h3>Productos Más Vendidos</h3>
        <Pie data={productosData} />
      </div>

      {/* Tabla de usuarios */}
      <h3>Gestión de Usuarios</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                <button onClick={() => setEditUser(u)}>Editar</button>
                <button onClick={() => handleDeleteUser(u.id_usuario)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de edición */}
      {editUser && (
        <div style={{ marginTop: "20px" }}>
          <h3>Editar Usuario</h3>
          <input
            type="text"
            value={editUser.nombre}
            onChange={(e) => setEditUser({ ...editUser, nombre: e.target.value })}
          />
          <input
            type="text"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <select
            value={editUser.rol}
            onChange={(e) => setEditUser({ ...editUser, rol: e.target.value })}
          >
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="administrador">Administrador</option>
          </select>
          <button onClick={handleEditUser}>Guardar Cambios</button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;


