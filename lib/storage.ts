const KEY = "meshimatch_ari_list";

export function getAriList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToAriList(shopId: string): void {
  if (typeof window === "undefined") return;
  const list = getAriList();
  if (list.includes(shopId)) return;
  list.push(shopId);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearAriList(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
