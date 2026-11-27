import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Aparece } from "../components/aparece";
import { Boton } from "../components/boton";
import { Campo } from "../components/campo";
import { Letrero } from "../components/letrero";
import { useAuth } from "../context/auth";
import { apiFetch } from "../lib/api";
import { CONTENEDOR } from "../lib/disenio";

type Ubicacion = { latitud: number; longitud: number };

export default function CompletarPerfil() {
    const { token, perfil, recargarPerfil } = useAuth();
    const negocio = perfil?.negocio;
    const [nombreNegocio, setNombreNegocio] = useState(negocio?.nombre ?? "");
    const [barrio, setBarrio] = useState(negocio?.barrio ?? "");
    const [descripcion, setDescripcion] = useState(negocio?.descripcion ?? "");
    const [ubicacion, setUbicacion] = useState<Ubicacion | null>(
        negocio?.latitud != null && negocio?.longitud != null
            ? { latitud: negocio.latitud, longitud: negocio.longitud }
            : null,
    );
    const [buscando, setBuscando] = useState(false);
    const [avisoUbicacion, setAvisoUbicacion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);

    async function usarMiUbicacion() {
        setAvisoUbicacion(null);
        setBuscando(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setAvisoUbicacion(
                    "Sin permiso no podemos ubicar tu tienda en el mapa. Puedes darlo después desde los ajustes del celular.",
                );
                return;
            }
            const posicion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setUbicacion({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
        } catch {
            setAvisoUbicacion("No pudimos obtener tu ubicación. Revisa que el GPS esté encendido.");
        } finally {
            setBuscando(false);
        }
    }

    async function guardar() {
        setError(null);
        if (nombreNegocio.trim().length < 2 || !barrio.trim()) {
            setError("Escribe el nombre de tu tienda y tu barrio.");
            return;
        }
        setGuardando(true);
        try {
            await apiFetch(
                "/api/auth/completar-perfil",
                {
                    method: "POST",
                    body: JSON.stringify({
                        nombreNegocio: nombreNegocio.trim(),
                        barrio: barrio.trim(),
                        descripcion: descripcion.trim() || undefined,
                        latitud: ubicacion?.latitud,
                        longitud: ubicacion?.longitud,
                    }),
                },
                token,
            );
            await recargarPerfil();
            router.replace("/");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No pudimos guardar tu tienda.");
        } finally {
            setGuardando(false);
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
                            Cuéntanos de tu tienda
                        </Text>
                        <Text className="text-center font-nunito text-lg leading-[27px] text-vitrina-tinta">
                            Así los vecinos te encuentran en el mapa.
                        </Text>
                    </View>
                </Aparece>
                <Aparece orden={2}>
                    <View className="gap-4">
                        <Campo
                            etiqueta="Nombre de la tienda"
                            value={nombreNegocio}
                            onChangeText={setNombreNegocio}
                            placeholder="Tienda de doña Rosa"
                        />
                        <Campo etiqueta="Barrio" value={barrio} onChangeText={setBarrio} placeholder="La Esmeralda" />
                        <Campo
                            etiqueta="¿Qué vendes? (opcional)"
                            value={descripcion}
                            onChangeText={setDescripcion}
                            placeholder="Empanadas, tamales y café"
                        />

                        <View className="gap-3 rounded-2xl border border-vitrina-borde bg-white p-4">
                            <Text className="font-nunito-semibold text-base text-vitrina-azul">Ubicación de la tienda</Text>
                            <Text className="font-nunito text-base leading-6 text-vitrina-tinta">
                                {ubicacion
                                    ? "Listo, tu tienda quedó ubicada donde estás ahora."
                                    : "Úsala estando en la tienda para que aparezca en el lugar correcto."}
                            </Text>
                            {avisoUbicacion && (
                                <Text className="font-nunito text-base leading-6 text-vitrina-ladrillo">{avisoUbicacion}</Text>
                            )}
                            <Boton
                                titulo={ubicacion ? "Volver a ubicar" : "Usar mi ubicación"}
                                variante="secundario"
                                onPress={usarMiUbicacion}
                                cargando={buscando}
                            />
                        </View>

                        {error && <Text className="font-nunito text-base text-vitrina-ladrillo">{error}</Text>}
                        <Boton titulo="Guardar y abrir mi vitrina" onPress={guardar} cargando={guardando} />
                    </View>
                </Aparece>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}