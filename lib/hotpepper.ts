import type { Shop } from "@/types/shop";

const ENDPOINT = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

function mapShop(raw: any, origin?: { lat: number; lng: number }): Shop {
  const lat = Number(raw.lat);
  const lng = Number(raw.lng);
  return {
    id: raw.id,
    name: raw.name,
    genre: raw.genre?.name ?? "",
    budget: raw.budget?.name ?? "",
    distance: origin ? haversine(origin.lat, origin.lng, lat, lng) : 0,
    photoUrl: raw.photo?.mobile?.l ?? raw.photo?.pc?.l ?? "",
    shopUrl: raw.urls?.pc ?? "",
    lat,
    lng,
  };
}

export async function searchShopsByLocation(lat: number, lng: number): Promise<Shop[]> {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) throw new Error("HOTPEPPER_API_KEY not set");
  const url = new URL(ENDPOINT);
  url.searchParams.set("key", key);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lng", String(lng));
  url.searchParams.set("range", "2"); // 500m
  url.searchParams.set("count", "20");
  url.searchParams.set("format", "json");
  const res = await fetch(url.toString());
  const data = await res.json();
  const shops = data?.results?.shop ?? [];
  return shops.map((s: any) => mapShop(s, { lat, lng }));
}

export async function searchShopsByIds(ids: string[]): Promise<Shop[]> {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) throw new Error("HOTPEPPER_API_KEY not set");
  const url = new URL(ENDPOINT);
  url.searchParams.set("key", key);
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("count", String(Math.max(ids.length, 20)));
  url.searchParams.set("format", "json");
  const res = await fetch(url.toString());
  const data = await res.json();
  const shops = data?.results?.shop ?? [];
  return shops.map((s: any) => mapShop(s));
}
