import type { Shop } from "@/types/shop";

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg">
      {shop.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shop.photoUrl}
          alt={shop.name}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="h-64 w-full bg-gray-300" />
      )}
      <div className="p-4">
        <h2 className="text-lg font-bold text-black">{shop.name}</h2>
        <p className="mt-1 text-sm text-gray-700">{shop.genre}</p>
        <div className="mt-2 flex justify-between text-sm text-gray-700">
          <span>{shop.distance}m</span>
          <span>{shop.budget}</span>
        </div>
      </div>
    </div>
  );
}
