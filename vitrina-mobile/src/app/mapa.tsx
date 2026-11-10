import { router } from "expo-router";
import { Text, View } from "react-native";
import { Boton } from "../components/boton";

export default function Mapa() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-vitrina-fondo px-5">
      <Text className="text-center font-lora text-[32px] text-vitrina-azul">El mapa llega pronto</Text>
      <Text className="text-center font-nunito text-lg text-vitrina-tinta">
        Aquí vas a ver las tiendas de tu barrio.
      </Text>
      <View className="w-full max-w-[390px]">
        <Boton titulo="Volver" variante="secundario" onPress={() => router.back()} />
      </View>
    </View>
  );
}
