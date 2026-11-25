import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { almacen } from "../lib/almacen";
import { apiFetch } from "../lib/api";

const TOKEN_KEY = "vitrina_token";

export type Negocio = {
  id: number;
  nombre: string;
  barrio: string;
  descripcion: string | null;
  latitud: number | null;
  longitud: number | null;
};

export type Perfil = {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  onboardingCompletado: boolean;
  negocio: Negocio | null;
};

type AuthContextValue = {
  token: string | null;
  perfil: Perfil | null;
  cargando: boolean;
  iniciarSesion: (telefono: string, password: string) => Promise<void>;
  registrarse: (nombre: string, telefono: string, password: string) => Promise<void>;
  recargarPerfil: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function pedirPerfil(token: string) {
  return apiFetch<Perfil>("/api/auth/perfil", {}, token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function iniciar() {
      try {
        const guardado = await almacen.leer(TOKEN_KEY);
        if (!guardado) return;
        const datos = await pedirPerfil(guardado);
        setToken(guardado);
        setPerfil(datos);
      } catch {
        // Token vencido o inválido: se borra y se pide iniciar sesión de nuevo.
        await almacen.borrar(TOKEN_KEY);
      } finally {
        setCargando(false);
      }
    }
    iniciar();
  }, []);

  async function iniciarSesion(telefono: string, password: string) {
    const { access_token } = await apiFetch<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ telefono, password }),
    });
    const datos = await pedirPerfil(access_token);
    await almacen.guardar(TOKEN_KEY, access_token);
    setToken(access_token);
    setPerfil(datos);
  }

  async function registrarse(nombre: string, telefono: string, password: string) {
    await apiFetch("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify({ nombre, telefono, password }),
    });
    await iniciarSesion(telefono, password);
  }

  async function recargarPerfil() {
    if (!token) return;
    setPerfil(await pedirPerfil(token));
  }

  async function cerrarSesion() {
    await almacen.borrar(TOKEN_KEY);
    setToken(null);
    setPerfil(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, perfil, cargando, iniciarSesion, registrarse, recargarPerfil, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
