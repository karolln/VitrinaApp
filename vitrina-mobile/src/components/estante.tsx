import { Text, View } from "react-native";

const PRODUCTOS = [
  { nombre: "Empanadas", precio: "$2.500", color: "#F0B429" },
  { nombre: "Carantantas", precio: "$1.000", color: "#9DC6A0" },
  { nombre: "Tamal", precio: "$6.000", color: "#E08C6A" },
];

export function Estante() {
  return (
    <View>
      <View className="h-[120px] flex-row items-end gap-3 px-4">
        {PRODUCTOS.map((p) => (
          <View
            key={p.nombre}
            className="h-[120px] flex-1 justify-between rounded-lg p-3"
            style={{ backgroundColor: p.color }}
          >
            <Text className="font-nunito-bold text-sm text-vitrina-tinta">{p.nombre}</Text>
            <Text className="font-lora text-base text-vitrina-tinta">{p.precio}</Text>
          </View>
        ))}
      </View>
      <View className="h-4 rounded-t bg-[#7A5A43]" />
      <View className="h-2 rounded-b bg-[#5B4636]" />
    </View>
  );
}
