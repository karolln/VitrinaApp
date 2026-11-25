import { ScrollView, Text, View } from "react-native";
import type { Tienda } from "../hooks/useTiendas";
import type { Punto } from "../hooks/useUbicacion";

// En el navegador react-native-maps no funciona, así que mostramos las tiendas en lista.
export function MapaTiendas({ tiendas }: { tiendas: Tienda[]; centro: Punto | null }) {
    if (tiendas.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-center font-nunito text-base text-vitrina-tinta">
                    Todavía no hay tiendas en este barrio.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerClassName="gap-3 p-4">
            <Text className="font-nunito text-sm text-vitrina-tinta">
                Vista de lista. El mapa se ve en el celular.
            </Text>
            {tiendas.map((t) => (
                <View key={t.id} className="gap-1 rounded-xl border border-vitrina-borde p-4">
                    <Text className="font-nunito-bold text-base text-vitrina-azul">{t.nombre}</Text>
                    <Text className="font-nunito text-sm text-vitrina-tinta">{t.descripcion ?? t.barrio}</Text>
                    <Text className="font-nunito text-sm text-[#5A6B78]">
                        {t.latitud !== null ? "Ubicada en el mapa" : "Sin ubicación todavía"}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}