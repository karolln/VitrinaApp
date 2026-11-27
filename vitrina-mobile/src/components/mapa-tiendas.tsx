import { router, type Href } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { Tienda } from "../hooks/useTiendas";
import type { Punto } from "../hooks/useUbicacion";
import { metrosEntre, textoDistancia } from "../lib/distancia";

const POPAYAN: Punto = { latitud: 2.4448, longitud: -76.6147 };
const ZOOM = { latitudeDelta: 0.012, longitudeDelta: 0.012 };

export function MapaTiendas({ tiendas, centro }: { tiendas: Tienda[]; centro: Punto | null }) {
    const mapa = useRef<MapView>(null);
    const [elegida, setElegida] = useState<Tienda | null>(null);

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

    const distancia =
        elegida && centro
            ? textoDistancia(
                metrosEntre(centro, {
                    latitud: elegida.latitud as number,
                    longitud: elegida.longitud as number,
                }),
            )
            : null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <MapView
                ref={mapa}
                style={StyleSheet.absoluteFill}
                initialRegion={{ latitude: inicio.latitud, longitude: inicio.longitud, ...ZOOM }}
                showsUserLocation={centro !== null}
                onPress={() => setElegida(null)}
            >
                {ubicadas.map((t) => {
                    const activa = elegida?.id === t.id;
                    return (
                        <Marker
                            key={t.id}
                            coordinate={{ latitude: t.latitud as number, longitude: t.longitud as number }}
                            onPress={(e) => {
                                e.stopPropagation();
                                setElegida(t);
                            }}
                            accessibilityLabel={`Tienda ${t.nombre}`}
                        >
                            <View className="items-center">
                                <View
                                    className={`rounded-md px-2 py-1 ${activa ? "bg-vitrina-ladrillo" : "border-2 border-vitrina-ladrillo bg-white"
                                        }`}
                                >
                                    <Text
                                        className={`font-nunito-bold text-xs ${activa ? "text-white" : "text-vitrina-ladrillo"
                                            }`}
                                    >
                                        {t.nombre}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeftWidth: 6,
                                        borderRightWidth: 6,
                                        borderTopWidth: 8,
                                        borderLeftColor: "transparent",
                                        borderRightColor: "transparent",
                                        borderTopColor: "#B5452C",
                                    }}
                                />
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {elegida && (
                <View className="absolute bottom-3 left-3 right-3 gap-2 rounded-2xl bg-white p-4 shadow-lg">
                    <View className="flex-row items-baseline justify-between gap-2">
                        <Text className="flex-1 font-lora text-xl text-vitrina-azul">{elegida.nombre}</Text>
                        {distancia && (
                            <Text className="font-nunito-bold text-sm text-[#3E5466]">{distancia}</Text>
                        )}
                    </View>
                    <Text className="font-nunito text-base leading-6 text-vitrina-tinta">
                        {elegida.descripcion ?? elegida.barrio}
                    </Text>
                    <Pressable
                        onPress={() => router.push(`/tienda/${elegida.id}` as Href)}
                        accessibilityRole="link"
                        hitSlop={12}
                        className="self-start"
                    >
                        <Text className="font-nunito-bold text-base text-vitrina-azul underline">Ver vitrina</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}