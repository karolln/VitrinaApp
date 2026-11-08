export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://vitrina-dev.apolobyte.online";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
    throw new Error(msg ?? "Algo salió mal. Intenta de nuevo.");
  }

  return data as T;
}
