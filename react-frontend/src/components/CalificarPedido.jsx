import React, { useState } from "react";

function CalificarPedido() {
  const [idPedido, setIdPedido] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");

  const enviarCalificacion = () => {
    fetch("http://localhost:3001/cliente/calificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pedido: idPedido, puntuacion, comentario })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert("Calificación enviada");
      })
      .catch(err => console.error("Error al calificar:", err));
  };

  return (
    <div>
      <h3>Calificar pedido</h3>
      <input
        type="text"
        placeholder="ID del pedido"
        value={idPedido}
        onChange={(e) => setIdPedido(e.target.value)}
      />
      <input
        type="number"
        min="1"
        max="5"
        value={puntuacion}
        onChange={(e) => setPuntuacion(e.target.value)}
      />
      <textarea
        placeholder="Comentario"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />
      <button onClick={enviarCalificacion}>Enviar</button>
    </div>
  );
}

export default CalificarPedido;
