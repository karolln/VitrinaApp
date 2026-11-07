import { router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { Boton } from "../components/boton";
import { useAuth } from "../context/auth";

export default function Index() {
  const { token, cargando, cerrarSesion } = useAuth();

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-vitrina-fondo">
        <ActivityIndicator color="#1F4E6B" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-vitrina-fondo px-6">
      <Text className="text-5xl font-bold text-vitrina-azul">VitrinaApp</Text>
      <Text className="mb-10 mt-3 text-lg text-vitrina-tinta">
        {token
          ? "Tu sesión está abierta. Aquí va a estar tu tienda."
          : "La vitrina de tu negocio, siempre abierta."}
      </Text>
      {token ? (
        <Boton titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />
      ) : (
        <Boton titulo="Soy dueño de una tienda" onPress={() => router.push("/login")} />
      )}
    </View>
  );
}
