import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text } from "react-native";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { useAuth } from "../context/auth";

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
      className="flex-1 justify-center bg-vitrina-fondo px-6"
    >
      <Text className="text-4xl font-bold text-vitrina-azul">Hola de nuevo</Text>
      <Text className="mb-8 mt-2 text-base text-vitrina-tinta">
        Entra para manejar la vitrina de tu negocio.
      </Text>
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
      {error && <Text className="mb-4 text-base text-vitrina-ladrillo">{error}</Text>}
      <Boton titulo="Iniciar sesión" onPress={enviar} cargando={cargando} />
      <Pressable onPress={() => router.push("/registro")} className="mt-6">
        <Text className="text-center text-base font-semibold text-vitrina-azul">
          ¿No tienes cuenta? Crea una
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
