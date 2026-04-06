document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    if (data.role === "cliente") {
      window.location.href = "cliente.html";
    } else if (data.role === "vendedor") {
      window.location.href = "vendedor.html";
    } else if (data.role === "supervisor") {
      window.location.href = "admin.html";
    }
  } else {
    document.getElementById("errorMsg").innerText = "Correo o contraseña incorrectos. Intenta nuevamente.";
  }
});
