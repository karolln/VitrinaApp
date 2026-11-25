import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { Tienda } from "../hooks/useTiendas";
import type { Punto } from "../hooks/useUbicacion";

const POPAYAN: Punto = { latitud: 2.4448, longitud: -76.6147 };
const ZOOM = { latitudeDelta: 0.012, longitudeDelta: 0.012 };

export function MapaTiendas({ tiendas, centro }: { tiendas: Tienda[]; centro: Punto | null }) {
    const mapa = useRef<MapView>(null);
    const ubicadas = tiendas.filter((t) => t.latitud !== null && t.longitud !== null);
    const inicio = ubicadas[0]
        ? { latitud: ubicadas[0].latitud as number, longitud: ubicadas[0].longitud as number }
        : POPAYAN;

    useEffect(() => {
        if (!centro) return;
        mapa.current?.animateToRegion(
            { latitude: centro.latitud, longitude: centro.longitud, ...ZOOM },
            500,
        );
    }, [centro]);

    return (
        <MapView
            ref={mapa}
            style={StyleSheet.absoluteFill}
            initialRegion={{ latitude: inicio.latitud, longitude: inicio.longitud, ...ZOOM }}
            showsUserLocation={centro !== null}
        >
            {ubicadas.map((t) => (
                <Marker
                    key={t.id}
                    coordinate={{ latitude: t.latitud as number, longitude: t.longitud as number }}
                    title={t.nombre}
                    description={t.descripcion ?? t.barrio}
                    pinColor="#B5452C"
                />
            ))}
        </MapView>
    );
}