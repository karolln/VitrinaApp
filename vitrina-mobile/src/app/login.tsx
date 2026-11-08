import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { Letrero } from "../components/letrero";
import { useAuth } from "../context/auth";
import { CONTENEDOR } from "../lib/disenio";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    setError(null);
    if (!telefono || !password) {
      setError("Escribe tu teléfono y tu contraseña.");
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion(telefono, password);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-vitrina-fondo"
    >
      <ScrollView contentContainerClassName={CONTENEDOR} keyboardShouldPersistTaps="handled">
        <Aparece orden={0}>
          <Letrero />
        </Aparece>
        <Aparece orden={1}>
          <View className="gap-2">
            <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
              Hola de nuevo
            </Text>
            <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
              Entra para manejar la vitrina de tu negocio.
            </Text>
          </View>
        </Aparece>
        <Aparece orden={2}>
          <View className="gap-4">
            <Campo
              etiqueta="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="3001234567"
            />
            <Campo
              etiqueta="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Tu contraseña"
            />
            {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}
            <Boton titulo="Iniciar sesión" onPress={enviar} cargando={cargando} />
            <View className="flex-row flex-wrap items-center justify-center">
              <Text className="font-nunito text-base text-vitrina-tinta">¿No tienes cuenta? </Text>
              <Pressable onPress={() => router.push("/registro")} accessibilityRole="link" hitSlop={12}>
                <Text className="font-nunito-bold text-base text-vitrina-azul underline">Crea una</Text>
              </Pressable>
            </View>
          </View>
        </Aparece>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
