import { ReactNode } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

export function Aparece({ orden = 0, children }: { orden?: number; children: ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(orden * 90).duration(300)}>{children}</Animated.View>
  );
}
