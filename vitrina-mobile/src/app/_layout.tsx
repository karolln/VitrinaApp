import "../global.css";
import { Lora_700Bold, useFonts } from "@expo-google-fonts/lora";
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from "@expo-google-fonts/nunito-sans";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Entrada } from "../components/entrada";
import { AuthProvider } from "../context/auth";
import { NotificacionesProvider } from "../context/NotificacionesContext"; // ← NUEVO
import { almacen } from "../lib/almacen";
import { configurarNotificaciones } from "../lib/notificaciones"; // ← NUEVO

const CLAVE_ENTRADA = "vitrina_entrada_vista";

export default function RootLayout() {
  const [fuentesListas] = useFonts({
    Lora_700Bold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });
  const [yaLaVio, setYaLaVio] = useState<boolean | null>(null);
  const [mostrarEntrada, setMostrarEntrada] = useState(true);

  // NUEVO: configura cómo se muestran las notificaciones
  useEffect(() => {
    configurarNotificaciones();
  }, []);

  useEffect(() => {
    almacen
      .leer(CLAVE_ENTRADA)
      .then((valor) => setYaLaVio(valor === "si"))
      .catch(() => setYaLaVio(false));
  }, []);

  function terminarEntrada() {
    setMostrarEntrada(false);
    almacen.guardar(CLAVE_ENTRADA, "si").catch(() => {});
  }

  if (!fuentesListas || yaLaVio === null) return null;

  return (
    <AuthProvider>
      <NotificacionesProvider> {/* ← NUEVO */}
        <View style={{ flex: 1, backgroundColor: "#E3ECEC" }}>
          {mostrarEntrada ? (
            <Entrada corta={yaLaVio} onTerminar={terminarEntrada} />
          ) : (
            <Stack screenOptions={{ headerShown: false }} />
          )}
        </View>
      </NotificacionesProvider>
    </AuthProvider>
  );
}