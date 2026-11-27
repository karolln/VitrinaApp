import { Href, Redirect, router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { Estante } from "../components/estante";
import { Letrero } from "../components/letrero";
import { useAuth } from "../context/auth";
import { almacen } from "../lib/almacen";
import { CONTENEDOR } from "../lib/disenio";


function saludo() {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 18) return "Buenas tardes";
  return "Buenas noches";
}

function LetreroConTruco() {
  return (
    <Pressable onLongPress={() => __DEV__ && almacen.borrar("vitrina_entrada_vista")}>
      <Letrero />
    </Pressable>
  );
}

export default function Index() {
  const { token, perfil, cargando, cerrarSesion } = useAuth();

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-vitrina-fondo">
        <ActivityIndicator color="#1F4E6B" />
      </View>
    );
  }

  if (token && perfil && !perfil.negocio) {
    return <Redirect href="/completar-perfil" />;
  }

  if (token) {
    return (
      <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
        <Aparece orden={0}>
          <LetreroConTruco />
        </Aparece>
        <Aparece orden={1}>
          <View className="gap-2">
            <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
              {saludo()}, {perfil?.nombre.split(" ")[0]}
            </Text>
            <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
              {perfil?.negocio?.nombre}: aquí vas a manejar tus productos.
            </Text>
          </View>
        </Aparece>
        <Aparece orden={2}>
          <View className="gap-4">
            <Boton titulo="Ver mi vitrina" onPress={() => router.push("/mi-vitrina")} />
            <Boton titulo="Activar avisos" variante="secundario" onPress={() => router.push("/avisos")} />
            <Boton titulo="Ver estadísticas" variante="secundario" onPress={() => router.push("/estadisticas")} />
            <Boton titulo="Actualizar mi tienda" variante="secundario" onPress={() => router.push("/completar-perfil")} />
            <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
          </View>
        </Aparece>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
      <Aparece orden={0}>
        <LetreroConTruco />
      </Aparece>
      <Aparece orden={1}>
        <View className="gap-2">
          <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
            ¿Qué hay hoy en tu barrio?
          </Text>
          <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
            Mira qué tienen hoy las tiendas cerca de ti.
          </Text>
        </View>
      </Aparece>
      <Aparece orden={2}>
        <Estante />
      </Aparece>
      <Aparece orden={3}>
        <View className="gap-4">
          <Boton titulo="Ver tiendas cerca" onPress={() => router.push("/mapa")} />
          <Boton
            titulo="Activar avisos"
            variante="secundario"
            onPress={() => router.push("/avisos")}
          />
          <View className="flex-row flex-wrap items-center justify-center">
            <Text className="font-nunito text-base text-vitrina-tinta">¿Tienes una tienda? </Text>
            <Pressable onPress={() => router.push("/login")} accessibilityRole="link" hitSlop={12}>
              <Text className="font-nunito-bold text-base text-vitrina-azul underline">
                Abre tu vitrina
              </Text>
            </Pressable>
          </View>
        </View>
      </Aparece>
    </ScrollView>
  );
}