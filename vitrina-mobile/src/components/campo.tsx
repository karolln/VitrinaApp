import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & { etiqueta: string };

export function Campo({ etiqueta, ...props }: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-base font-semibold text-vitrina-azul">{etiqueta}</Text>
      <TextInput
        className="rounded-xl border border-vitrina-borde bg-white px-4 py-3 text-base text-vitrina-tinta"
        placeholderTextColor="#7A8C99"
        {...props}
      />
    </View>
  );
}
