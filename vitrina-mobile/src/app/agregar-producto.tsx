import { useState } from "react";
import { Image, Platform, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { useAuth } from "../context/auth";
import { CONTENEDOR } from "../lib/disenio";


const API = "https://vitrina-dev.apolobyte.online";

export default function AgregarProducto() {
  const { token, perfil } = useAuth();
  const [foto, setFoto] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function tomarFoto() {
    setError(null);
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      setError("Necesitamos la cámara para tomar la foto. Actívala en los ajustes del celular.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setFoto(res.assets[0].uri);
  }

  async function guardar() {
    if (!foto) return setError("Tómale una foto al producto primero.");
    setGuardando(true);
    setError(null);
    try {
      const form = new FormData();
      if (Platform.OS === "web") {
      const blob = await (await fetch(foto)).blob();
      form.append("foto", blob, "foto.jpg");
      } else {
      form.append("foto", { uri: foto, name: "foto.jpg", type: "image/jpeg" } as any);
}
        
      form.append("negocioId", String(perfil?.negocio?.id));
      if (nombre) form.append("nombre", nombre);
      if (precio) form.append("precio", String(Number(precio)));
      if (cantidad) form.append("cantidad", String(Number(cantidad)));

      // FormData: fetch directo, SIN Content-Type
      const r = await fetch(`${API}/api/productos/con-foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!r.ok) {
        const e = await r.json().catch(() => null);
        throw new Error(e?.message ?? "No pudimos guardar el producto.");
      }
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar el producto.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
      <Aparece orden={0}>
        <Text className="font-lora text-[32px] leading-[38px] text-vitrina-azul">
          Agrega un producto
        </Text>
        <Text className="font-nunito text-lg leading-[27px] text-vitrina-tinta">
          Tómale una foto y nosotros sugerimos el nombre.
        </Text>
      </Aparece>

      <Aparece orden={1}>
        <View className="gap-4">
          {foto && <Image source={{ uri: foto }} className="h-48 w-full rounded-2xl" />}
          <Boton titulo={foto ? "Tomar otra" : "Tomar foto"} variante="secundario" onPress={tomarFoto} />
          <Campo etiqueta="Nombre" value={nombre} onChangeText={setNombre} placeholder="Arroz" />
          <Campo etiqueta="Precio" value={precio} onChangeText={setPrecio} keyboardType="number-pad" />
          <Campo etiqueta="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="number-pad" />
          {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}
          <Boton titulo="Guardar producto" onPress={guardar} cargando={guardando} />
        </View>
      </Aparece>
    </ScrollView>
  );
}