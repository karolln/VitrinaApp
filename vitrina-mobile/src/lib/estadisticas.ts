import { apiFetch } from "./api";

type RespuestaEstadisticas = {
  negocioId: number;
  nombreNegocio: string;
  totalVisitas: number;
};

export type Estadisticas = {
  visitas: number;
};

export async function obtenerEstadisticas(
  negocioId: number,
  token: string
): Promise<Estadisticas> {
  const datos = await apiFetch<RespuestaEstadisticas | null>(
    `/api/negocios/${negocioId}/estadisticas`,
    {},
    token
  );
  return { visitas: datos?.totalVisitas ?? 0 };
}