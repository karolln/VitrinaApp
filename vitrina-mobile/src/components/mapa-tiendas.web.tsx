import { ScrollView, Text, View } from "react-native";
import type { Tienda } from "../hooks/useTiendas";
import type { Punto } from "../hooks/useUbicacion";
import { metrosEntre, textoDistancia } from "../lib/distancia";

// En el navegador react-native-maps no funciona, así que mostramos las tiendas en lista.
export function MapaTiendas({ tiendas, centro }: { tiendas: Tienda[]; centro: Punto | null }) {
    if (tiendas.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-center font-nunito text-base text-vitrina-tinta">
                    Todavía no hay tiendas registradas.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerClassName="gap-3 p-4">
            <Text className="font-nunito text-sm text-vitrina-tinta">
                Vista de lista. El mapa se ve en el celular.
            </Text>
            {tiendas.map((t) => {
                const ubicada = t.latitud !== null && t.longitud !== null;
                const distancia =
                    ubicada && centro
                        ? textoDistancia(
                            metrosEntre(centro, { latitud: t.latitud as number, longitud: t.longitud as number }),
                        )
                        : null;
                return (
                    <View key={t.id} className="gap-1 rounded-xl border border-vitrina-borde p-4">
                        <View className="flex-row items-baseline justify-between gap-2">
                            <Text className="flex-1 font-nunito-bold text-base text-vitrina-azul">{t.nombre}</Text>
                            {distancia && (
                                <Text className="font-nunito-bold text-sm text-[#3E5466]">{distancia}</Text>
                            )}
                        </View>
                        <Text className="font-nunito text-sm text-vitrina-tinta">
                            {t.descripcion ?? ""} · {t.barrio}
                        </Text>
                        {!ubicada && (
                            <Text className="font-nunito text-sm text-[#5A6B78]">Sin ubicación todavía</Text>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}