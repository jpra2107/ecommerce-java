import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import AdminDashboard from "./components/AdminDashboard";
import VendedorDashboard from "./components/VendedorDashboard";
import ClienteDashboard from "./components/ClienteDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/vendedor" element={<VendedorDashboard />} />
          <Route path="/cliente" element={<ClienteDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


