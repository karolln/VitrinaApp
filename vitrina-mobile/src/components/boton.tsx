import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  variante?: "primario" | "secundario";
};

export function Boton({ titulo, onPress, cargando = false, variante = "primario" }: Props) {
  const primario = variante === "primario";
  return (
    <Pressable
      onPress={onPress}
      disabled={cargando}
      accessibilityRole="button"
      className={`h-12 items-center justify-center rounded-full active:opacity-80 ${
        primario ? "bg-vitrina-azul" : "border-2 border-vitrina-azul"
      } ${cargando ? "opacity-60" : ""}`}
    >
      {cargando ? (
        <ActivityIndicator color={primario ? "#FFFFFF" : "#1F4E6B"} />
      ) : (
        <Text className={`font-nunito-bold text-lg ${primario ? "text-white" : "text-vitrina-azul"}`}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}
