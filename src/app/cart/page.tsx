"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type LocalItem = {
  variantId: string;
  quantity: number;
  title?: string;
  price?: number; // 税込・税抜どちらでも。未設定なら表示スキップ
  image?: string;
  handle?: string;
};

const KEY1 = "okome_local_cart"; // 本アドバイスで推奨しているキー
const KEY2 = "okome_cart";       // 以前の実装や別名で入っている可能性に備えて

export default function CartPage() {
  const [storeKey, setStoreKey] = useState<string>(KEY1);
  const [items, setItems] = useState<LocalItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // localStorage から読込
  useEffect(() => {
    try {
      const raw1 = typeof window !== "undefined" ? localStorage.getItem(KEY1) : null;
      const raw2 = typeof window !== "undefined" ? localStorage.getItem(KEY2) : null;

      let parsed: LocalItem[] = [];
      let key = KEY1;

      if (raw1) {
        parsed = JSON.parse(raw1);
        key = KEY1;
      } else if (raw2) {
        parsed = JSON.parse(raw2);
        key = KEY2;
      }

      // フォーマットゆるめに正規化
      const norm = Array.isArray(parsed)
        ? parsed
          .map((it: any) => ({
            variantId: String(it?.variantId ?? it?.id ?? ""),
            quantity: Number(it?.quantity ?? 1),
            title: it?.title ?? "",
            price: typeof it?.price === "number" ? it.price : Number(it?.price ?? NaN),
            image: it?.image ?? it?.imageUrl ?? "",
            handle: it?.handle ?? "",
          }))
          .filter((it) => it.variantId && Number.isFinite(it.quantity) && it.quantity > 0)
        : [];

      setStoreKey(key);
      setItems(norm);
    } catch {
      // 破損時は空扱い
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  // 合計
  const total = useMemo(() => {
    return items.reduce((acc, it) => {
      const p = Number.isFinite(it.price ?? NaN) ? (it.price as number) : 0;
      return acc + p * it.quantity;
    }, 0);
  }, [items]);

  const save = (next: LocalItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch { }
  };

  const removeAt = (idx: number) => {
    const next = items.slice();
    next.splice(idx, 1);
    save(next);
  };

  const changeQty = (idx: number, qty: number) => {
    const q = Math.max(1, Math.min(99, Math.floor(qty || 1)));
    const next = items.slice();
    next[idx] = { ...next[idx], quantity: q };
    save(next);
  };

  if (!loaded) {
    return <p style={{ padding: "1.5rem" }}>読み込み中…</p>;
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>カートの中身</h1>

      {items.length === 0 ? (
        <p>カートに商品がありません。</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((it, idx) => (
              <li
                key={`${it.variantId}:${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr auto",
                  gap: "12px",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ width: 90, height: 90, background: "#f6f6f6", display: "grid", placeItems: "center" }}>
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.title ?? ""} width={90} height={90} style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 12, color: "#999" }}>画像なし</span>
                  )}
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>
                    {it.handle ? <Link href={`/product/${it.handle}`}>{it.title ?? "商品"}</Link> : it.title ?? "商品"}
                  </div>
                  <div style={{ marginTop: 4, color: "#666" }}>
                    単価:{" "}
                    {Number.isFinite(it.price ?? NaN) ? `${Number(it.price).toLocaleString()} 円` : "—"}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    数量:{" "}
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={it.quantity}
                      onChange={(e) => changeQty(idx, Number(e.target.value))}
                      style={{ width: 70 }}
                    />{" "}
                    <button
                      onClick={() => removeAt(idx)}
                      style={{ marginLeft: 8, padding: "4px 10px", border: "1px solid #ddd", background: "#fff" }}
                    >
                      削除
                    </button>
                  </div>

                  {/* 最短導線：この1件だけで購入手続きへ（/checkout のクエリ読み取りに合わせる） */}
                  <div style={{ marginTop: 8 }}>
                    <Link
                      href={`/checkout?variant=${encodeURIComponent(it.variantId)}&qty=${it.quantity}`}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        background: "#2f7d32",
                        color: "#fff",
                        borderRadius: 6,
                      }}
                    >
                      この商品を購入手続きへ
                    </Link>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 14, textAlign: "right" }}>
                  {Number.isFinite(it.price ?? NaN)
                    ? `${(Number(it.price) * it.quantity).toLocaleString()} 円`
                    : "—"}
                </div>
              </li>
            ))}
          </ul>

          <div style={{ textAlign: "right", marginTop: 16, fontWeight: 700 }}>
            小計: {total.toLocaleString()} 円
          </div>

          <p style={{ marginTop: 10, color: "#666", fontSize: 12 }}>
            ※ いまは最短接続のため、まとめ買いの「一括チェックアウト」は未対応です。各商品の「この商品を購入手続きへ」から進めます。
          </p>
        </>
      )}
    </div>
  );
}
