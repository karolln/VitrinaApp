import type { Punto } from "../hooks/useUbicacion";

// Distancia en metros entre dos puntos del mapa (fórmula de Haversine).
export function metrosEntre(a: Punto, b: Punto): number {
    const R = 6371000; // radio de la Tierra en metros
    const rad = (g: number) => (g * Math.PI) / 180;
    const dLat = rad(b.latitud - a.latitud);
    const dLon = rad(b.longitud - a.longitud);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(a.latitud)) * Math.cos(rad(b.latitud)) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// Texto corto para mostrar: "350 m" o "1,2 km".
export function textoDistancia(metros: number): string {
    if (metros < 1000) return `${metros} m`;
    return `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}