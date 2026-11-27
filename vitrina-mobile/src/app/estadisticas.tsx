import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { useAuth } from "../context/auth";
import { CONTENEDOR } from "../lib/disenio";
import { Estadisticas, obtenerEstadisticas } from "../lib/estadisticas";

export default function EstadisticasScreen() {
  const { token, perfil, cargando: cargandoSesion } = useAuth();
  const [datos, setDatos] = useState<Estadisticas | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const negocioId = perfil?.negocio?.id;

  const cargar = useCallback(async () => {
    if (!negocioId || !token) return;
    setCargando(true);
    setError(false);
    try {
      setDatos(await obtenerEstadisticas(negocioId, token));
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, [negocioId, token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargandoSesion) {
    return (
      <View className="flex-1 items-center justify-center bg-vitrina-fondo">
        <ActivityIndicator color="#1F4E6B" />
      </View>
    );
  }

  // Solo el dueño con sesión puede ver sus estadísticas
  if (!token || !negocioId) return <Redirect href="/login" />;

  return (
    <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
      <Aparece orden={0}>
        <View className="gap-2">
          <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
            Visitas a tu vitrina
          </Text>
          <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
            Así de visitada está {perfil?.negocio?.nombre ?? "tu tienda"}.
          </Text>
        </View>
      </Aparece>

      <Aparece orden={1}>
        <View className="items-center gap-2 rounded-2xl bg-white p-6">
          {cargando ? (
            <ActivityIndicator color="#1F4E6B" />
          ) : error ? (
            <>
              <Text className="text-center font-nunito-bold text-lg text-vitrina-tinta">
                No pudimos traer tus visitas
              </Text>
              <Text className="text-center font-nunito text-base text-vitrina-tinta">
                Revisa tu conexión e inténtalo de nuevo en un momento.
              </Text>
            </>
          ) : (
            <>
              <Text className="font-lora text-[56px] leading-[64px] text-vitrina-azul">
                {datos?.visitas ?? 0}
              </Text>
              <Text className="text-center font-nunito text-base text-vitrina-tinta">
                {datos?.visitas === 1 ? "persona ha visitado" : "personas han visitado"} tu
                vitrina
              </Text>
            </>
          )}
        </View>
      </Aparece>

      <Aparece orden={2}>
        <View className="gap-4">
          {error && <Boton titulo="Reintentar" onPress={cargar} />}
          <Boton titulo="Volver" variante="secundario" onPress={() => router.back()} />
        </View>
      </Aparece>
    </ScrollView>
  );
}