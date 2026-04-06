import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "./ClienteDashboard.css";
import HistorialPedidos from "./HistorialPedidos";
import CalificarPedido from "./CalificarPedido";

function ClienteDashboard() {
  const { user } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Tarjeta"); // estado para método de pago
  const [vista, setVista] = useState("productos"); // controla qué vista mostrar

  useEffect(() => {
    // Fetch productos desde backend
    fetch("http://localhost:3001/cliente/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id_producto === producto.id_producto);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    setCarrito(
      carrito.map((p) =>
        p.id_producto === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((p) => p.id_producto !== id));
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const confirmarCompra = () => {
    fetch("http://localhost:3001/cliente/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_cliente: user.id_usuario,
        productos: carrito,
        metodo_pago: metodoPago,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Pedido confirmado con ID: " + data.id_pedido);
        setCarrito([]);
        setMostrarCarrito(false);
      })
      .catch((err) => console.error("Error confirmando compra:", err));
  };

  return (
    <div className="cliente-dashboard">
      <aside className="sidebar">
        <h3>Menú Cliente</h3>
        <ul>
          <li><button onClick={() => setVista("configurar")}>Configurar cuenta</button></li>
          <li><button onClick={() => setVista("historial")}>Histórico de pedidos</button></li>
          <li><button onClick={() => setVista("facturas")}>Facturas</button></li>
          <li><button onClick={() => setVista("calificar")}>Calificar pedido</button></li>
          <li><button onClick={() => setVista("pedido")}>Pedido en curso</button></li>
          <li><button onClick={() => setVista("editar")}>Editar pedido</button></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>Bienvenido, {user?.nombre || "Cliente"}</h2>
          <button className="cart-btn" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
            🛒 Carrito ({carrito.length})
          </button>
        </header>

        {/* Vista dinámica */}
        {vista === "productos" && !mostrarCarrito && (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id_producto} className="producto-card">
                <h4>{producto.nombre}</h4>
                <p>Precio: ${producto.precio}</p>
                <p>Stock: {producto.stock}</p>
                <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
              </div>
            ))}
          </div>
        )}

        {mostrarCarrito && (
          <div className="carrito">
            <h3>Carrito de Compras</h3>
            {carrito.length === 0 ? (
              <p>No hay productos en el carrito</p>
            ) : (
              <div>
                {carrito.map((p) => (
                  <div key={p.id_producto} className="carrito-item">
                    <span>{p.nombre} - ${p.precio}</span>
                    <input
                      type="number"
                      value={p.cantidad}
                      min="1"
                      onChange={(e) => actualizarCantidad(p.id_producto, parseInt(e.target.value))}
                    />
                    <button onClick={() => eliminarProducto(p.id_producto)}>Eliminar</button>
                  </div>
                ))}
                <h4>Total: ${total.toFixed(2)}</h4>
                <h4>Método de pago:</h4>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
                <button className="confirm-btn" onClick={confirmarCompra}>Confirmar compra</button>
              </div>
            )}
          </div>
        )}

        {vista === "historial" && <HistorialPedidos />}
        {vista === "calificar" && <CalificarPedido />}
        {vista === "configurar" && <p>Aquí iría la configuración de cuenta</p>}
        {vista === "facturas" && <p>Aquí se mostrarán las facturas</p>}
        {vista === "pedido" && <p>Aquí se mostraría el pedido en curso</p>}
        {vista === "editar" && <p>Aquí se editaría el pedido</p>}
      </main>
    </div>
  );
}

export default ClienteDashboard;

