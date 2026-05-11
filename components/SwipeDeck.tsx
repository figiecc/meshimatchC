"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TinderCardImport from "react-tinder-card";
import type { Shop } from "@/types/shop";
import { addToAriList } from "@/lib/storage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TinderCard = TinderCardImport as any;

export default function SwipeDeck({ shops }: { shops: Shop[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string>("");

  const done = index >= shops.length;
  const current = shops[index];

  function onSwipe(dir: string) {
    if (!current) return;
    if (dir === "right") {
      addToAriList(current.id);
      setLastAction(`「あり」: ${current.name}`);
    } else if (dir === "left") {
      setLastAction(`「なし」: ${current.name}`);
    }
  }

  function onCardLeftScreen() {
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-sm text-gray-700">
        {Math.min(index + 1, shops.length)} / {shops.length}
      </p>

      <div className="relative h-[420px] w-full">
        {!done && current && (
          <TinderCard
            key={current.id}
            onSwipe={onSwipe}
            onCardLeftScreen={onCardLeftScreen}
            preventSwipe={["up", "down"]}
            className="absolute inset-0"
          >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg select-none">
              {current.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.photoUrl}
                  alt={current.name}
                  className="pointer-events-none h-64 w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="h-64 w-full bg-gray-300" />
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold text-black">{current.name}</h2>
                <p className="mt-1 text-sm text-gray-700">{current.genre}</p>
                <div className="mt-2 flex justify-between text-sm text-gray-700">
                  <span>{current.distance}m</span>
                  <span>{current.budget}</span>
                </div>
              </div>
            </div>
          </TinderCard>
        )}
        {done && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-gray-700">全部見終わりました</p>
          </div>
        )}
      </div>

      <p className="mt-4 h-5 text-sm text-gray-700">{lastAction}</p>

      <div className="mt-2 flex w-full justify-between px-4 text-sm text-gray-700">
        <span>← なし</span>
        <span>あり →</span>
      </div>

      {done && (
        <button
          onClick={() => router.push("/list")}
          className="mt-6 w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-bold text-white shadow"
        >
          ありリストを見る
        </button>
      )}
    </div>
  );
}
