import { almacen } from "../lib/almacen";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const TOKEN_KEY = "vitrina_token";

type AuthContextValue = {
  token: string | null;
  cargando: boolean;
  iniciarSesion: (telefono: string, password: string) => Promise<void>;
  registrarse: (nombre: string, telefono: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    almacen.leer(TOKEN_KEY)
      .then(setToken)
      .finally(() => setCargando(false));
  }, []);

  async function iniciarSesion(telefono: string, password: string) {
    const { access_token } = await apiFetch<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ telefono, password }),
    });
    await almacen.guardar(TOKEN_KEY, access_token);
    setToken(access_token);
  }

  async function registrarse(nombre: string, telefono: string, password: string) {
    await apiFetch("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify({ nombre, telefono, password }),
    });
    await iniciarSesion(telefono, password);
  }

  async function cerrarSesion() {
    await almacen.borrar(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, cargando, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
