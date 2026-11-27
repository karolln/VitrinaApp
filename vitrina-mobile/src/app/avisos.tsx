import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { useNotificaciones } from "../context/NotificacionesContext";
import { CONTENEDOR } from "../lib/disenio";
import { enviarAviso } from "../lib/notificaciones";

export default function AvisosScreen() {
  const { avisosActivos, cargando, alternarAvisos } = useNotificaciones();

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-vitrina-fondo">
        <ActivityIndicator color="#1F4E6B" />
      </View>
    );
  }

  async function onChange(valor: boolean) {
    const resultado = await alternarAvisos(valor);
    if (resultado === "denegado") {
      Alert.alert(
        "Avisos desactivados",
        "Sin el permiso no podemos avisarte de las novedades. Puedes intentarlo de nuevo cuando quieras."
      );
    } else if (resultado === "bloqueado") {
      Alert.alert(
        "Permiso bloqueado",
        "Para recibir avisos, activa las notificaciones de Vitrina en los ajustes del teléfono.",
        [
          { text: "Ahora no", style: "cancel" },
          { text: "Abrir ajustes", onPress: () => Linking.openSettings() },
        ]
      );
    }
  }

  async function probar() {
    try {
      await enviarAviso("Vitrina", "Ya hay empanadas en la tienda de doña Rosa");
    } catch {
      Alert.alert("No se pudo enviar", "Intenta de nuevo en un momento.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
      <Aparece orden={0}>
        <View className="gap-2">
          <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
            Entérate de lo nuevo
          </Text>
          <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
            Te avisamos en tu celular cuando las tiendas de tu barrio tengan novedades, por
            ejemplo, que ya hay empanadas recién hechas.
          </Text>
        </View>
      </Aparece>

      <Aparece orden={1}>
        <View className="gap-3 rounded-2xl bg-white p-4">
          <Text className="font-nunito text-base text-vitrina-tinta">
            Para esto necesitamos tu permiso para enviarte notificaciones. Solo las usamos para
            avisarte de las tiendas, y puedes desactivarlas cuando quieras.
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="font-nunito-bold text-base text-vitrina-tinta">
              Recibir avisos
            </Text>
            <Switch value={avisosActivos} onValueChange={onChange} />
          </View>
        </View>
      </Aparece>

      <Aparece orden={2}>
        <View className="gap-4">
          {avisosActivos && <Boton titulo="Ver un aviso de prueba" onPress={probar} />}
          <Boton titulo="Volver" variante="secundario" onPress={() => router.back()} />
        </View>
      </Aparece>
    </ScrollView>
  );
}