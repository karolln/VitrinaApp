import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & { etiqueta: string };

export function Campo({ etiqueta, ...props }: Props) {
  return (
    <View className="gap-2">
      <Text className="font-nunito-semibold text-base text-vitrina-azul">{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        className="h-12 rounded-xl border border-vitrina-borde bg-white px-4 font-nunito text-lg text-vitrina-tinta"
        placeholderTextColor="#5A6B78"
        {...props}
      />
    </View>
  );
}
