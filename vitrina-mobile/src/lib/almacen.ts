import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const esWeb = Platform.OS === "web";

export const almacen = {
  async leer(clave: string) {
    if (esWeb) return globalThis.localStorage?.getItem(clave) ?? null;
    return SecureStore.getItemAsync(clave);
  },
  async guardar(clave: string, valor: string) {
    if (esWeb) return globalThis.localStorage?.setItem(clave, valor);
    return SecureStore.setItemAsync(clave, valor);
  },
  async borrar(clave: string) {
    if (esWeb) return globalThis.localStorage?.removeItem(clave);
    return SecureStore.deleteItemAsync(clave);
  },
};
