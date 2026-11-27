import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { useAuth } from "../context/auth";
import { API_URL, apiFetch } from "../lib/api";
import { CONTENEDOR } from "../lib/disenio";


type Producto = { 
  id: number; 
  nombre: string;
  precio: number | null; 
  cantidad: number; 
  fotoUrl: string; 
  estado: "disponible" | "agotado"; 
};

// La API guarda la foto como "/uploads/...": le pegamos la dirección del servidor.
function urlFoto(fotoUrl: string) {
  return fotoUrl.startsWith("/") ? `${API_URL}${fotoUrl}` : fotoUrl;
}

// 2500 -> "$2.500"
function textoPrecio(precio: number | null) {
  if (precio == null) return "Sin precio";
  return "$" + String(precio).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function MiVitrina() {
  const { token, perfil } = useAuth();
  const negocioId = perfil?.negocio?.id;
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cambiando, setCambiando] = useState<number | null>(null);

  async function cargar() {
    if (!negocioId) return;
    setError(null);
    try {
      const datos = await apiFetch<Producto[]>(`/api/productos/negocio/${negocioId}`);
      setProductos(datos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos cargar tus productos.");
    } finally {
      setCargando(false);
    }
  }

  // Recarga cada vez que la pantalla vuelve a verse
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [negocioId])
  );

  async function cambiarEstado(producto: Producto) {
    setCambiando(producto.id);
    setError(null);
    try {
      const actualizado = await apiFetch<Producto>(
        `/api/productos/${producto.id}/estado`,
        { method: "PATCH" },
        token
      );
      setProductos((lista) => lista.map((p) => (p.id === actualizado.id ? actualizado : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos cambiar el estado.");
    } finally {
      setCambiando(null);
    }
  }

  const disponibles = productos.filter((p) => p.estado === "disponible").length;

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
        <View className="gap-2">
          <Pressable onPress={() => router.back()} accessibilityRole="link" hitSlop={12} className="self-start">
            <Text className="font-nunito-bold text-base text-vitrina-azul">Volver</Text>
          </Pressable>
          <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul">
            Mi vitrina
          </Text>
          <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
            {perfil?.negocio?.nombre} · hoy tienes {disponibles} de {productos.length} productos disponibles.
          </Text>
        </View>
      </Aparece>

      <Aparece orden={1}>
        <View className="gap-4">
          {productos.length === 0 ? (
            <View className="rounded-2xl border border-vitrina-borde bg-white p-4">
              <Text className="font-nunito text-base leading-6 text-vitrina-tinta">
                Todavía no tienes productos. Agrega el primero con una foto.
              </Text>
            </View>
          ) : (
            <View className="overflow-hidden rounded-2xl border border-vitrina-borde bg-white">
              {productos.map((p, i) => {
                const agotado = p.estado === "agotado";
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => router.push(`/producto/${p.id}` as Href)}
                    accessibilityRole="button"
                    accessibilityLabel={`Editar ${p.nombre}`}
                    className={`flex-row items-center gap-4 p-4 active:bg-vitrina-fondo ${i < productos.length - 1 ? "border-b border-vitrina-fondo" : ""}`}
                  >
                    <Image
                      source={{ uri: urlFoto(p.fotoUrl) }}
                      className={`h-12 w-12 rounded-lg bg-vitrina-fondo ${agotado ? "opacity-50" : ""}`}
                    />
                    <View className="flex-1 gap-1">
                      <Text className={`font-nunito-bold text-base ${agotado ? "text-[#5A6B78]" : "text-vitrina-tinta"}`}>
                        {p.nombre}
                      </Text>
                      <Text className="font-nunito text-sm text-[#3E5466]">
                        {textoPrecio(p.precio)} · {p.cantidad} unidades
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => cambiarEstado(p)}
                      disabled={cambiando === p.id}
                      accessibilityRole="button"
                      accessibilityLabel={agotado ? `Marcar ${p.nombre} como disponible` : `Marcar ${p.nombre} como agotado`}
                      hitSlop={8}
                      className={`rounded-full px-3 py-1 ${agotado ? "bg-[#F8E3DE]" : "bg-[#E3F1EA]"} ${cambiando === p.id ? "opacity-50" : ""}`}
                    >
                      <Text className={`font-nunito-bold text-sm ${agotado ? "text-[#9E2F17]" : "text-[#1E6B45]"}`}>
                        {agotado ? "Agotado" : "Disponible"}
                      </Text>
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          )}
          {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}
          <Text className="font-nunito text-base leading-6 text-[#3E5466]">
            Toca la etiqueta para cambiar el estado. Toca el producto para editarlo.
          </Text>
        </View>
      </Aparece>

      <Aparece orden={2}>
      <Boton titulo="Agregar producto" onPress={() => router.push("/agregar-producto" as Href)} />
      </Aparece>
    </ScrollView>
  );
}