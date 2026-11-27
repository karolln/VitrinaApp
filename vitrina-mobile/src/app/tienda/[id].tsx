import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Aparece } from "../../components/aparece";
import { Boton } from "../../components/boton";
import { API_URL, apiFetch } from "../../lib/api";
import { CONTENEDOR } from "../../lib/disenio";

type ProductoPublico = {
  id: number;
  nombre: string;
  precio: number | null;
  fotoUrl: string;
}; 

type TiendaPublica = { 
  id: number; 
  nombre: string; 
  barrio: string; 
  descripcion: string | null; 
  catalogoEnConstruccion: boolean; 
  productos: ProductoPublico[]; 
}; 

function urlFoto(fotoUrl: string) { 
  return fotoUrl.startsWith("/") ? `${API_URL}${fotoUrl}` : fotoUrl;
} 

function textoPrecio(precio: number | null) { 
  if (precio == null) return "Pregunta el precio"; 
  return "$" + String(precio).replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
}; 

export default function VitrinaPublica() { 
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const [tienda, setTienda] = useState<TiendaPublica | null>(null); 
  const [cargando, setCargando] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  async function cargar() { 
    setCargando(true); 
    setError(null); 
    try { 
      const datos = await apiFetch<TiendaPublica>(`/api/negocios/${id}`); 
      setTienda(datos); 
      // Cuenta la visita. Si falla, no se le muestra nada al vecino. 
      apiFetch(`/api/negocios/${id}/visita`, { method: "POST" }).catch(() => {}); 
    } catch (e) { 
      setError(e instanceof Error ? e.message : "No pudimos abrir esta tienda."); 
    } finally { 
      setCargando(false); 
    } 
  }

  useEffect(() => { 
    cargar(); 
  }, [id]); 

  if (cargando) { 
    return ( 
      <View className="flex-1 items-center justify-center bg-vitrina-fondo"> 
        <ActivityIndicator color="#1F4E6B" /> 
      </View> 
    ); 
  } 

  if (error || !tienda) { 
    return ( 
      <View className="flex-1 justify-center gap-4 bg-vitrina-fondo px-5"> 
        <Text className="text-center font-nunito text-lg text-vitrina-ladrillo">{error}</Text> 
        <Boton titulo="Intentar de nuevo" variante="secundario" onPress={cargar} /> 
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
          <View className="items-center gap-2"> 
            <View className="rounded-lg bg-vitrina-ladrillo px-4 py-1"> 
              <Text className="font-lora text-base text-white">Abierto</Text> 
            </View> 
            <Text className="text-center font-lora text-[32px] leading-[38px] text-vitrina-azul"> 
              {tienda.nombre} 
            </Text> 
            <Text className="font-nunito-bold text-base text-[#3E5466]"> 
              {tienda.barrio}
            </Text> 
            {tienda.descripcion && ( 
              <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta"> 
                {tienda.descripcion} 
              </Text> 
            )} 
          </View> 
        </View> 
      </Aparece> 

      <Aparece orden={1}> 
        {tienda.catalogoEnConstruccion ? ( 
          <View className="rounded-2xl border border-vitrina-borde bg-white p-4"> 
            <Text className="text-center font-nunito text-base leading-6 text-vitrina-tinta"> 
              Esta tienda está armando su vitrina. Vuelve pronto. 
            </Text> 
          </View> 
        ) : ( 
          <View className="gap-3"> 
            <Text className="font-nunito-bold text-base text-vitrina-azul"> 
              Hoy hay {tienda.productos.length} {tienda.productos.length === 1 ? "producto" : "productos"} 
            </Text> 
            <View className="flex-row flex-wrap justify-between gap-y-3"> 
              {tienda.productos.map((p) => ( 
                <View key={p.id} className="w-[48%] overflow-hidden rounded-2xl border border-vitrina-borde bg-white"> 
                  <Image source={{ uri: urlFoto(p.fotoUrl) }} className="h-24 w-full bg-vitrina-fondo" /> 
                  <View className="gap-1 p-3"> 
                    <Text className="font-nunito-bold text-base leading-5 text-vitrina-tinta">{p.nombre}</Text> 
                    <Text className="font-lora text-base text-vitrina-tinta">{textoPrecio(p.precio)}</Text> 
                  </View> 
                </View> 
              ))} 
            </View>
          </View>
        )} 
      </Aparece> 
    </ScrollView> 
  );
}