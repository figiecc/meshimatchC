import { searchShopsByIds, searchShopsByLocation } from "@/lib/hotpepper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  try {
    if (ids) {
      const shops = await searchShopsByIds(ids.split(",").filter(Boolean));
      return Response.json(shops);
    }
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    if (!lat || !lng) {
      return Response.json({ error: "lat/lng required" }, { status: 400 });
    }
    const shops = await searchShopsByLocation(lat, lng);
    return Response.json(shops);
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}
