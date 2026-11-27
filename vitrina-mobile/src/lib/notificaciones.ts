import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type ResultadoPermiso = "concedido" | "denegado" | "bloqueado";

export function configurarNotificaciones() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function permisoConcedido(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

// "bloqueado" = el sistema ya no deja volver a preguntar (hay que ir a ajustes)
export async function pedirPermisos(): Promise<ResultadoPermiso> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("avisos", {
        name: "Avisos",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const actual = await Notifications.getPermissionsAsync();
    if (actual.status === "granted") return "concedido";
    if (!actual.canAskAgain) return "bloqueado";

    const nuevo = await Notifications.requestPermissionsAsync();
    if (nuevo.status === "granted") return "concedido";
    return nuevo.canAskAgain ? "denegado" : "bloqueado";
  } catch {
    return "denegado";
  }
}

export async function enviarAviso(titulo: string, cuerpo: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: null,
  });
}