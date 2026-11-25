import * as Location from "expo-location";
import { useState } from "react";

export type Punto = { latitud: number; longitud: number };

export function useUbicacion() {
    const [ubicacion, setUbicacion] = useState<Punto | null>(null);
    const [buscando, setBuscando] = useState(false);
    const [aviso, setAviso] = useState<string | null>(null);

    async function pedirUbicacion() {
        setAviso(null);
        setBuscando(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setAviso("Sin permiso de ubicación no podemos mostrar lo que está cerca de ti.");
                return;
            }
            const posicion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setUbicacion({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
        } catch {
            setAviso("No pudimos obtener tu ubicación. Revisa que el GPS esté encendido.");
        } finally {
            setBuscando(false);
        }
    }

    return { ubicacion, buscando, aviso, pedirUbicacion };
}