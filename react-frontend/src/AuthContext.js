import React, { createContext, useState } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}