"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Shop } from "@/types/shop";
import { getAriList } from "@/lib/storage";

function ListInner() {
  const params = useSearchParams();
  const idsParam = params.get("ids");
  const isShared = !!idsParam;

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState<string>("");

  useEffect(() => {
    const ids = isShared
      ? idsParam!.split(",").filter(Boolean)
      : getAriList();

    if (ids.length === 0) {
      setShops([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/shops?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setShops(data);
      })
      .finally(() => setLoading(false));
  }, [idsParam, isShared]);

  async function handleShare() {
    const ids = getAriList();
    if (ids.length === 0) {
      setCopyMsg("ありリストが空です");
      return;
    }
    const url = `${window.location.origin}/list?ids=${ids.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyMsg("コピーしました！LINEに貼り付けて友達に送ってください");
    } catch {
      setCopyMsg(`コピーできませんでした。手動でコピー: ${url}`);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-black">
        {isShared ? "共有されたリスト" : "あなたのありリスト"}
      </h1>

      {!isShared && (
        <div className="mb-6">
          <button
            onClick={handleShare}
            className="w-full rounded-2xl bg-red-500 px-6 py-4 font-bold text-white shadow"
          >
            このリストを共有する
          </button>
          {copyMsg && (
            <p className="mt-2 text-sm text-gray-700">{copyMsg}</p>
          )}
        </div>
      )}

      {loading && <p className="text-gray-700">読み込み中...</p>}

      {!loading && shops.length === 0 && (
        <p className="text-gray-700">
          {isShared ? "店が見つかりませんでした" : "まだ「あり」がありません"}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {shops.map((s) => (
          <a
            key={s.id}
            href={s.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-xl bg-white p-3 shadow"
          >
            {s.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.photoUrl}
                alt={s.name}
                className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-300" />
            )}
            <div className="flex-1">
              <h2 className="text-base font-bold text-black">{s.name}</h2>
              <p className="text-sm text-gray-700">{s.genre}</p>
              <p className="mt-1 text-xs text-gray-700">
                {s.distance ? `${s.distance}m / ` : ""}
                {s.budget}
              </p>
            </div>
          </a>
        ))}
      </div>

      <a
        href="/"
        className="mt-8 inline-block text-sm text-gray-700 underline"
      >
        ホームに戻る
      </a>
    </div>
  );
}

export default function ListPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[480px] bg-white px-4 py-6">
      <Suspense fallback={<p className="text-gray-700">読み込み中...</p>}>
        <ListInner />
      </Suspense>
    </main>
  );
}
