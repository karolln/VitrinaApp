import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { Letrero } from "../components/letrero";
import { useAuth } from "../context/auth";
import { CONTENEDOR } from "../lib/disenio";

export default function Registro() {
  const { registrarse } = useAuth();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    setError(null);
    if (!nombre || !telefono || !password) {
      setError("Completa los tres campos.");
      return;
    }
    setCargando(true);
    try {
      await registrarse(nombre, telefono, password);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos crear la cuenta.");
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
              Abre tu vitrina
            </Text>
            <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
              Crea la cuenta de tu negocio en un minuto.
            </Text>
          </View>
        </Aparece>
        <Aparece orden={2}>
          <View className="gap-4">
            <Campo etiqueta="Tu nombre" value={nombre} onChangeText={setNombre} placeholder="María Fernández" />
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
              placeholder="Mínimo 6 caracteres"
            />
            {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}
            <Boton titulo="Crear cuenta" onPress={enviar} cargando={cargando} />
            <View className="flex-row flex-wrap items-center justify-center">
              <Text className="font-nunito text-base text-vitrina-tinta">¿Ya tienes cuenta? </Text>
              <Pressable onPress={() => router.back()} accessibilityRole="link" hitSlop={12}>
                <Text className="font-nunito-bold text-base text-vitrina-azul underline">Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </Aparece>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
