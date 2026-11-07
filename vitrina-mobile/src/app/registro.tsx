import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text } from "react-native";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { useAuth } from "../context/auth";

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
      className="flex-1 justify-center bg-vitrina-fondo px-6"
    >
      <Text className="text-4xl font-bold text-vitrina-azul">Abre tu vitrina</Text>
      <Text className="mb-8 mt-2 text-base text-vitrina-tinta">
        Crea la cuenta de tu negocio en un minuto.
      </Text>
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
      {error && <Text className="mb-4 text-base text-vitrina-ladrillo">{error}</Text>}
      <Boton titulo="Crear cuenta" onPress={enviar} cargando={cargando} />
      <Pressable onPress={() => router.back()} className="mt-6">
        <Text className="text-center text-base font-semibold text-vitrina-azul">
          Ya tengo cuenta
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
