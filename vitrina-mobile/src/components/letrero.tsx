import { Text, View } from "react-native";

export function Letrero() {
  return (
    <View className="items-center" accessible accessibilityLabel="Abierto">
      <View className="h-9 w-[60px]">
        <View className="absolute left-[26px] top-0 h-2 w-2 rounded-full bg-[#5B5B5B]" />
        <View
          className="absolute left-[29px] top-1 h-[42px] w-[2px] bg-[#3B3B3B]"
          style={{ transformOrigin: "top", transform: [{ rotate: "40deg" }] }}
        />
        <View
          className="absolute left-[29px] top-1 h-[42px] w-[2px] bg-[#3B3B3B]"
          style={{ transformOrigin: "top", transform: [{ rotate: "-40deg" }] }}
        />
      </View>
      <View className="h-10 w-[120px] items-center justify-center rounded-lg bg-vitrina-ladrillo">
        <Text className="font-lora text-xl text-white">Abierto</Text>
      </View>
    </View>
  );
}
