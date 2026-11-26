import React, { createContext, useContext, useEffect, useState } from "react";
import { almacen } from "../lib/almacen";
import { pedirPermisos, permisoConcedido, ResultadoPermiso } from "../lib/notificaciones";

type NotificacionesCtx = {
  avisosActivos: boolean;
  cargando: boolean;
  alternarAvisos: (activar: boolean) => Promise<ResultadoPermiso>;
};

const NotificacionesContext = createContext<NotificacionesCtx | null>(null);
const CLAVE = "avisos_activos";

export function NotificacionesProvider({ children }: { children: React.ReactNode }) {
  const [avisosActivos, setAvisosActivos] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Recupera la preferencia y confirma que el permiso del sistema siga activo
  useEffect(() => {
    (async () => {
      try {
        const guardado = (await almacen.leer(CLAVE)) === "true";
        setAvisosActivos(guardado && (await permisoConcedido()));
      } catch {
        setAvisosActivos(false);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const alternarAvisos = async (activar: boolean): Promise<ResultadoPermiso> => {
    if (activar) {
      const resultado = await pedirPermisos();
      if (resultado !== "concedido") {
        setAvisosActivos(false);
        almacen.guardar(CLAVE, "false").catch(() => {});
        return resultado;
      }
    }
    setAvisosActivos(activar);
    almacen.guardar(CLAVE, String(activar)).catch(() => {});
    return "concedido";
  };

  return (
    <NotificacionesContext.Provider value={{ avisosActivos, cargando, alternarAvisos }}>
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext);
  if (!ctx) throw new Error("useNotificaciones debe usarse dentro de NotificacionesProvider");
  return ctx;
}