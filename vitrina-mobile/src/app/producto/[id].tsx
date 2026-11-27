import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Aparece } from "../../components/aparece";
import { Boton } from "../../components/boton";
import { Campo } from "../../components/campo";
import { useAuth } from "../../context/auth";
import { apiFetch } from "../../lib/api";
import { CONTENEDOR } from "../../lib/disenio";

const API = "https://vitrina-dev.apolobyte.online";

type Producto = {
  id: number;
  nombre: string;
  precio: number | null;
  cantidad: number | null;
  fotoUrl: string;
  estado: "disponible" | "agotado";
};

export default function EditarProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, perfil } = useAuth();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fotoNueva, setFotoNueva] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const lista = await apiFetch<Producto[]>(
          `/api/productos/negocio/${perfil?.negocio?.id}`,
          {},
          token,
        );
        const p = lista.find((x) => String(x.id) === id);
        if (!p) throw new Error("No encontramos este producto");
        setProducto(p);
        setNombre(p.nombre);
        setPrecio(p.precio != null ? String(p.precio) : "");
        setCantidad(p.cantidad != null ? String(p.cantidad) : "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "No pudimos cargar el producto.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function cambiarFoto() {
    setError(null);
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      setError("Necesitamos la cámara para cambiar la foto. Actívala en los ajustes del celular.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled) setFotoNueva(res.assets[0].uri);
  }

  async function subirFoto(uri: string): Promise<{ fotoUrl: string; idTemporal: number }> {
    const form = new FormData();
    if (Platform.OS === "web") {
      const blob = await (await fetch(uri)).blob();
      form.append("foto", blob, "foto.jpg");
    } else {
      form.append("foto", { uri, name: "foto.jpg", type: "image/jpeg" } as any);
    }
    form.append("negocioId", String(perfil?.negocio?.id));

    const r = await fetch(`${API}/api/productos/con-foto`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!r.ok) {
      const e = await r.json().catch(() => null);
      throw new Error(e?.message ?? "No pudimos subir la foto.");
    }
    const data = await r.json();
    return { fotoUrl: data.fotoUrl, idTemporal: data.id };
  }

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      const cuerpo: Record<string, unknown> = {
        nombre,
        precio: Number(precio),
        cantidad: Number(cantidad),
      };

      let idTemporal: number | null = null;
      if (fotoNueva) {
        const subida = await subirFoto(fotoNueva);
        cuerpo.fotoUrl = subida.fotoUrl;
        idTemporal = subida.idTemporal;
      }

      await apiFetch(
        `/api/productos/${id}`,
        { method: "PATCH", body: JSON.stringify(cuerpo) },
        token,
      );

      // Limpieza: si existe la ruta DELETE, borra el producto temporal
      if (idTemporal) {
        try {
          await apiFetch(`/api/productos/${idTemporal}`, { method: "DELETE" }, token);
        } catch {
          // si no existe esa ruta, no pasa nada con la pantalla
        }
      }

      if (router.canGoBack()) {
  router.back();
} else {
  router.replace("/");
}
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado() {
    if (!producto) return;
    const nuevo = producto.estado === "disponible" ? "agotado" : "disponible";
    try {
      await apiFetch(
        `/api/productos/${id}/estado`,
        { method: "PATCH", body: JSON.stringify({ estado: nuevo }) },
        token,
      );
      if (router.canGoBack()) {
  router.back();
} else {
  router.replace("/");
}
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos cambiar el estado.");
    }
  }

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-vitrina-fondo">
        <ActivityIndicator color="#1F4E6B" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-vitrina-fondo" contentContainerClassName={CONTENEDOR}>
      <Aparece orden={0}>
        <Text className="font-lora text-[32px] leading-[38px] text-vitrina-azul">
          Editar producto
        </Text>
      </Aparece>

      <Aparece orden={1}>
        <View className="gap-4">
          {producto && (
            <View className="flex-row items-center gap-4 rounded-2xl border border-vitrina-borde bg-white p-4">
              <Image
                source={{ uri: fotoNueva ?? `${API}${producto.fotoUrl}` }}
                className="h-16 w-16 rounded-xl"
              />
              <View className="flex-1">
                <Text className="font-nunito-bold text-lg text-vitrina-tinta">
                  {producto.nombre}
                </Text>
                <Text className="font-nunito text-base text-vitrina-tinta">
                  {producto.estado === "disponible" ? "Disponible" : "Agotado"}
                </Text>
              </View>
              <Text
                onPress={cambiarFoto}
                className="font-nunito-bold text-base text-vitrina-azul underline"
              >
                Cambiar foto
              </Text>
            </View>
          )}

          <Campo etiqueta="Nombre" value={nombre} onChangeText={setNombre} />
          <Campo etiqueta="Precio" value={precio} onChangeText={setPrecio} keyboardType="number-pad" />
          <Campo etiqueta="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="number-pad" />

          {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}

          <Boton titulo="Guardar cambios" onPress={guardar} cargando={guardando} />
          <Boton
            titulo={producto?.estado === "agotado" ? "Marcar como disponible" : "Marcar como agotado"}
            variante="secundario"
            onPress={cambiarEstado}
          />
        </View>
      </Aparece>
    </ScrollView>
  );
}