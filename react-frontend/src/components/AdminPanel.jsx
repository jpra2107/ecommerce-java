import React, { useEffect, useState } from "react";
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

function AdminPanel() {
  const [dashboard, setDashboard] = useState({});
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productos, setProductos] = useState([]);

  // Llamadas al backend
  useEffect(() => {
    fetch("/admin/dashboard")
      .then(res => res.json())
      .then(data => setDashboard(data));

    fetch("/admin/ventas-mensuales")
      .then(res => res.json())
      .then(data => setVentasMensuales(data));

    fetch("/admin/productos-mas-vendidos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  // Datos para gráficos
  const ventasData = {
    labels: ["Ventas del Mes", "Pedidos Pendientes", "Stock Bajo", "Clientes Activos"],
    datasets: [
      {
        label: "Estadísticas",
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
    labels: ventasMensuales.map(v => `Mes ${v.mes}`),
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
        backgroundColor: ["#3b82f6", "#f97316", "#ef4444", "#22c55e", "#a855f7"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen admin-theme">
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

      {/* Gráfico de resumen */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h3 className="font-semibold mb-2">Resumen General</h3>
        <Bar data={ventasData} />
      </div>

      {/* Gráfico de ventas mensuales */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h3 className="font-semibold mb-2">Ventas Mensuales</h3>
        <Line data={ventasMensualesData} />
      </div>

      {/* Gráfico de productos más vendidos */}
      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h3 className="font-semibold mb-2">Productos Más Vendidos</h3>
        <Pie data={productosData} />
      </div>
    </div>
  );
}

export default AdminPanel;
