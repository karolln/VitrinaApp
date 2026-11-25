import { useCallback, useEffect, useState } from "react";
import type { Negocio } from "../context/auth";
import { apiFetch } from "../lib/api";

export type Tienda = Negocio;

export function useTiendas(barrio: string) {
    const [tiendas, setTiendas] = useState<Tienda[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await apiFetch<Tienda[]>(
                `/api/negocios/buscar?barrio=${encodeURIComponent(barrio)}`,
            );
            setTiendas(datos);
        } catch (e) {
            setError(e instanceof Error ? e.message : "No pudimos cargar las tiendas.");
        } finally {
            setCargando(false);
        }
    }, [barrio]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    return { tiendas, cargando, error, recargar: cargar };
}