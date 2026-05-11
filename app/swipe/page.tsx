"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SwipeDeck from "@/components/SwipeDeck";
import type { Shop } from "@/types/shop";

function SwipeInner() {
  const params = useSearchParams();
  const lat = params.get("lat");
  const lng = params.get("lng");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;
    setLoading(true);
    fetch(`/api/shops?lat=${lat}&lng=${lng}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setShops(data);
      })
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) {
    return <p className="mt-20 text-center text-gray-700">探しています...</p>;
  }

  if (shops.length === 0) {
    return <p className="mt-20 text-center text-gray-700">店が見つかりませんでした</p>;
  }

  return <SwipeDeck shops={shops} />;
}

export default function SwipePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[480px] bg-white px-4 py-6">
      <Suspense fallback={<p className="mt-20 text-center text-gray-700">読み込み中...</p>}>
        <SwipeInner />
      </Suspense>
    </main>
  );
}
