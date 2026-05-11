"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FALLBACK = { lat: 35.6896, lng: 139.7006 }; // 新宿駅

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function go(lat: number, lng: number) {
    router.push(`/swipe?lat=${lat}&lng=${lng}`);
  }

  function handleClick() {
    setLoading(true);
    if (!navigator.geolocation) {
      go(FALLBACK.lat, FALLBACK.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => go(pos.coords.latitude, pos.coords.longitude),
      () => go(FALLBACK.lat, FALLBACK.lng),
      { timeout: 8000 }
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center bg-white px-6 py-10">
      <h1 className="mb-12 text-3xl font-bold text-black">メシマッチ</h1>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-2xl bg-red-500 px-6 py-5 text-lg font-bold text-white shadow disabled:opacity-60"
      >
        {loading ? "現在地を取得中..." : "現在地で店を探す"}
      </button>
      <a href="/list" className="mt-10 text-sm text-gray-700 underline">
        ありリストを見る
      </a>
    </main>
  );
}
