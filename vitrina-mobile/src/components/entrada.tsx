import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const C = {
    fondo: "#E3ECEC",
    azul: "#1F4E6B",
    tinta: "#102A43",
    ladrillo: "#B5452C",
    cerrado: "#3F4A52",
    madera: "#7A5A43",
    maderaOscura: "#5B4636",
    cuerda: "#3B3B3B",
    clavo: "#5B5B5B",
};

const PRODUCTOS = [
    { nombre: "Empanadas", precio: "$2.500", color: "#F0B429" },
    { nombre: "Carantantas", precio: "$1.000", color: "#9DC6A0" },
    { nombre: "Tamal", precio: "$6.000", color: "#E08C6A" },
];

type ProductoProps = {
    nombre: string;
    precio: string;
    color: string;
    retraso: number;
    reducir: boolean;
};

function Producto({ nombre, precio, color, retraso, reducir }: ProductoProps) {
    const y = useSharedValue(reducir ? 0 : -500);
    const opacidad = useSharedValue(reducir ? 1 : 0);

    useEffect(() => {
        if (reducir) return;
        y.value = withDelay(retraso, withTiming(0, { duration: 420, easing: Easing.out(Easing.back(1.6)) }));
        opacidad.value = withDelay(retraso, withTiming(1, { duration: 120 }));
    }, []);

    const estilo = useAnimatedStyle(() => ({
        opacity: opacidad.value,
        transform: [{ translateY: y.value }],
    }));

    return (
        <Animated.View style={[e.producto, { backgroundColor: color }, estilo]}>
            <Text style={e.productoNombre}>{nombre}</Text>
            <Text style={e.productoPrecio}>{precio}</Text>
        </Animated.View>
    );
}

export function Entrada({ onTerminar, corta = false }: { onTerminar: () => void; corta?: boolean }) {
    const reducir = useReducedMotion() || corta;
    const [abierto, setAbierto] = useState(reducir);
    const terminado = useRef(false);

    const caida = useSharedValue(reducir ? 0 : -600);
    const balanceo = useSharedValue(0);
    const aplastar = useSharedValue(1);
    const marca = useSharedValue(reducir ? 1 : 0);
    const repisa = useSharedValue(reducir ? 1 : 0);
    const pantalla = useSharedValue(1);

    function salir() {
        if (terminado.current) return;
        terminado.current = true;
        pantalla.value = withTiming(0, { duration: 200 });
        setTimeout(onTerminar, 220);
    }

    useEffect(() => {
        if (reducir) {
            const t = setTimeout(salir, 800);
            return () => clearTimeout(t);
        }
        caida.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
        balanceo.value = withDelay(
            300,
            withSequence(
                withTiming(10, { duration: 120 }),
                withTiming(-6, { duration: 150 }),
                withTiming(3, { duration: 140 }),
                withTiming(0, { duration: 120 }),
            ),
        );
        aplastar.value = withDelay(
            850,
            withSequence(withTiming(0, { duration: 90 }), withTiming(1, { duration: 90 })),
        );
        marca.value = withDelay(1550, withTiming(1, { duration: 400 }));
        repisa.value = withDelay(1650, withTiming(1, { duration: 300 }));

        const voltear = setTimeout(() => setAbierto(true), 1340);
        const fin = setTimeout(salir, 3600);
        return () => {
            clearTimeout(voltear);
            clearTimeout(fin);
        };
    }, []);

    const estiloPantalla = useAnimatedStyle(() => ({ opacity: pantalla.value }));
    const estiloColgante = useAnimatedStyle(() => ({
        transform: [{ translateY: caida.value }, { rotate: `${balanceo.value}deg` }],
    }));
    const estiloLetrero = useAnimatedStyle(() => ({ transform: [{ scaleX: aplastar.value }] }));
    const estiloMarca = useAnimatedStyle(() => ({
        opacity: marca.value,
        transform: [{ translateY: (1 - marca.value) * 16 }],
    }));
    const estiloRepisa = useAnimatedStyle(() => ({
        opacity: repisa.value,
        transform: [{ scaleX: 0.4 + 0.6 * repisa.value }],
    }));

    return (
        <Animated.View style={[e.raiz, estiloPantalla]}>
            <Pressable
                style={e.toque}
                onPress={salir}
                accessibilityRole="button"
                accessibilityLabel="Saltar la entrada"
            >
                <View style={e.contenido}>
                    <Animated.View style={[e.colgante, estiloColgante]}>
                        <View style={e.clavoZona}>
                            <View style={e.clavo} />
                            <View style={[e.cuerda, { transform: [{ rotate: "40deg" }] }]} />
                            <View style={[e.cuerda, { transform: [{ rotate: "-40deg" }] }]} />
                        </View>
                        <Animated.View
                            style={[e.letrero, { backgroundColor: abierto ? C.ladrillo : C.cerrado }, estiloLetrero]}
                        >
                            <Text style={e.letreroTexto}>{abierto ? "Abierto" : "Cerrado"}</Text>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View style={[e.marca, estiloMarca]}>
                        <Text style={e.titulo}>VitrinaApp</Text>
                        <Text style={e.lema}>La vitrina de tu negocio, siempre abierta.</Text>
                    </Animated.View>

                    <View>
                        <View style={e.fila}>
                            {PRODUCTOS.map((p, i) => (
                                <Producto key={p.nombre} {...p} retraso={1800 + i * 150} reducir={reducir} />
                            ))}
                        </View>
                        <Animated.View style={estiloRepisa}>
                            <View style={e.repisa} />
                            <View style={e.repisaSombra} />
                        </Animated.View>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const e = StyleSheet.create({
    raiz: { flex: 1, backgroundColor: C.fondo },
    toque: { flex: 1 },
    contenido: {
        flex: 1,
        width: "100%",
        maxWidth: 430,
        alignSelf: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        gap: 56,
    },
    colgante: { alignItems: "center", transformOrigin: "top" },
    clavoZona: { width: 120, height: 72 },
    clavo: { position: "absolute", top: 0, left: 52, width: 16, height: 16, borderRadius: 8, backgroundColor: C.clavo },
    cuerda: { position: "absolute", top: 8, left: 59, width: 3, height: 84, backgroundColor: C.cuerda, transformOrigin: "top" },
    letrero: {
        width: 240,
        height: 80,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: C.tinta,
        shadowOpacity: 0.24,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    letreroTexto: { fontFamily: "Lora_700Bold", fontSize: 40, color: "#FFFFFF" },
    marca: { alignItems: "center", gap: 8 },
    titulo: { fontFamily: "Lora_700Bold", fontSize: 36, lineHeight: 43, color: C.azul, textAlign: "center" },
    lema: { fontFamily: "NunitoSans_400Regular", fontSize: 18, lineHeight: 27, color: C.tinta, textAlign: "center" },
    fila: { height: 120, flexDirection: "row", gap: 12, paddingHorizontal: 16, alignItems: "flex-end" },
    producto: { flex: 1, height: 120, borderRadius: 8, padding: 12, justifyContent: "space-between" },
    productoNombre: { fontFamily: "NunitoSans_700Bold", fontSize: 14, color: C.tinta },
    productoPrecio: { fontFamily: "Lora_700Bold", fontSize: 16, color: C.tinta },
    repisa: { height: 16, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: C.madera },
    repisaSombra: { height: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, backgroundColor: C.maderaOscura },
});