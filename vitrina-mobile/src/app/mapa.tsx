import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Boton } from "../components/boton";
import { MapaTiendas } from "../components/mapa-tiendas";
import { useTiendas } from "../hooks/useTiendas";
import { useUbicacion } from "../hooks/useUbicacion";
import { metrosEntre } from "../lib/distancia";

const COLUMNA = "mx-auto w-full max-w-[430px] px-5";

export default function Mapa() {
  const { tiendas, cargando, error, recargar } = useTiendas();
  const { ubicacion, buscando, aviso, pedirUbicacion } = useUbicacion();

  // Con tu ubicación, las tiendas ubicadas se ordenan de la más cercana a la más lejana.
  const ordenadas = ubicacion
    ? [...tiendas].sort((a, b) => {
      if (a.latitud === null || a.longitud === null) return 1;
      if (b.latitud === null || b.longitud === null) return -1;
      return (
        metrosEntre(ubicacion, { latitud: a.latitud, longitud: a.longitud }) -
        metrosEntre(ubicacion, { latitud: b.latitud, longitud: b.longitud })
      );
    })
    : tiendas;

  return (
    <View className="flex-1 bg-vitrina-fondo">
      <View className={`${COLUMNA} gap-2 pb-4 pt-16`}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="link"
          hitSlop={12}
          className="self-start"
        >
          <Text className="font-nunito-bold text-base text-vitrina-azul">← Volver</Text>
        </Pressable>
        <Text className="font-lora text-[32px] leading-[38px] text-vitrina-azul">
          Tiendas cerca de ti
        </Text>
        <Text className="font-nunito text-lg leading-[27px] text-vitrina-tinta">
          {cargando
            ? "Buscando tiendas…"
            : ubicacion
              ? `${tiendas.length} ${tiendas.length === 1 ? "tienda" : "tiendas"}, de la más cercana a la más lejana.`
              : `${tiendas.length} ${tiendas.length === 1 ? "tienda" : "tiendas"} en VitrinaApp.`}
        </Text>
      </View>

      <View className={`${COLUMNA} flex-1`}>
        <View className="flex-1 overflow-hidden rounded-2xl border border-vitrina-borde bg-white">
          {cargando ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#1F4E6B" />
            </View>
          ) : error ? (
            <View className="flex-1 justify-center gap-4 p-5">
              <Text className="text-center font-nunito text-base text-vitrina-ladrillo">{error}</Text>
              <Boton titulo="Intentar de nuevo" variante="secundario" onPress={recargar} />
            </View>
          ) : (
            <MapaTiendas tiendas={ordenadas} centro={ubicacion} />
          )}
        </View>
      </View>

      <View className={`${COLUMNA} gap-3 pb-10 pt-4`}>
        {aviso && <Text className="font-nunito text-base text-vitrina-ladrillo">{aviso}</Text>}
        <Boton titulo="Ver lo que está cerca de mí" onPress={pedirUbicacion} cargando={buscando} />
      </View>
    </View>
  );
}