"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./CheckoutPage.module.scss";
import { api } from "@/lib/api";
import { selectInitialAddressId } from "@/lib/selectInitialAddressId";
import { formatPostal7 } from "@/lib/format";
// ★ 型も一緒にインポート
import CheckoutStartButton from "@/components/CheckoutStartButton";

type Address = {
  id: number;
  recipient_name: string;
  postal_code: string;
  address_1: string;
  address_2: string;
  phone: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

type CheckoutLine = {
  variantId?: string;
  merchandiseId?: string;
  id?: string;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 住所一覧の取得
  useEffect(() => {
    let canceled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await api<Address[]>("/addresses", {
          method: "GET",
          cache: "no-store",
        });
        if (!canceled) {
          setAddresses(rows);
        }
      } catch (_e) {
        if (!canceled) setError("住所の取得に失敗しました。時間をおいて再度お試しください。");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  // 取得直後に初期選択を自動適用
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    setSelectedAddressId((prev) => prev ?? selectInitialAddressId(addresses));
  }, [addresses]);

  const selected = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  // —— 最短で“動かす”ための lines 注入口（URLクエリから拾う）——
  // 例）/checkout?variant=gid://shopify/ProductVariant/XXX&qty=2
  const urlVariant = search.get("variant") || "";
  const urlQty = Number(search.get("qty") || "1");

  // ★ ここで型注釈を付ける（CheckoutLine[]）
  const lines = useMemo<CheckoutLine[]>(() => {
    if (!urlVariant) return [];
    const q = Number.isFinite(urlQty) && urlQty > 0 ? urlQty : 1;
    return [{ variantId: urlVariant, quantity: q }];
  }, [urlVariant, urlQty]);

  // Shopify shippingAddress 形式へマッピング
  const shippingAddress = useMemo(() => {
    if (!selected) return undefined;
    // recipient_name をざっくり氏名分解（半角/全角スペース分割）
    const parts = String(selected.recipient_name || "").trim().split(/\s+/);
    const firstName = parts.length >= 2 ? parts[1] : parts[0] || "";
    const lastName = parts.length >= 2 ? parts[0] : "";
    return {
      firstName,
      lastName,
      address1: selected.address_1,
      address2: selected.address_2 || "",
      zip: selected.postal_code,
      phone: selected.phone,
      // 任意で city / province / country なども必要に応じて
    };
  }, [selected]);

  // 既存の「次へ」動線（確認画面へ）
  const handleNext = async () => {
    if (!selectedAddressId) return;
    router.push(`/confirm?addressId=${selectedAddressId}`);
  };

  if (loading) {
    return <p className={styles.page}>読み込み中…</p>;
  }
  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.h1}>チェックアウト</h1>
        <p>配送先住所が登録されていません。</p>
        <p>
          <Link className={styles.link} href="/mypage/addresses">
            住所を追加する
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>チェックアウト</h1>

      <section className={styles.section}>
        <h2 className={styles.h2}>配送先を選択</h2>

        <ul className={styles.lines}>
          {addresses.map((a) => {
            const isSelected = a.id === selectedAddressId;
            return (
              <li key={a.id} className={styles.line}>
                <label className={styles.row}>
                  <input
                    type="radio"
                    name="address"
                    value={a.id}
                    checked={isSelected}
                    onChange={() => setSelectedAddressId(a.id)}
                  />
                  <span className={styles.body}>
                    <strong className={styles.name}>{a.recipient_name}</strong>
                    {a.is_default ? <span className={styles.badgeDefault}>既定</span> : null}
                    <span className={styles.addr}>
                      〒{formatPostal7 ? formatPostal7(a.postal_code) : a.postal_code}
                      {"　"}
                      {a.address_1}
                      {a.address_2 ? ` ${a.address_2}` : ""}
                    </span>
                    <span className={styles.phone}>{a.phone}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className={styles.actionRow}>
          <Link className={styles.link} href="/mypage/addresses">
            住所を編集・追加する
          </Link>
        </div>
      </section>

      <div className={styles.actions}>
        {/* 既存の確認画面へ（残してOK） */}
        <button
          className={styles.secondary}
          type="button"
          disabled={!selectedAddressId}
          onClick={handleNext}
        >
          次へ（確認画面へ）
        </button>

        {/* Shopify チェックアウトへ直行（最短動作） */}
        <CheckoutStartButton
          lines={lines}
          shippingAddress={shippingAddress}
          className={styles.primary}
          label="お会計へ"
        />
      </div>

      {/* ヒント表示（variant をクエリで渡す簡易テスト用） */}
      {!lines.length && (
        <p className={styles.note}>
          ※ 動作テスト用に <code>?variant=gid://shopify/ProductVariant/…&amp;qty=1</code>{" "}
          をURLに付けると「Shopifyでお会計へ」ボタンが有効になります。
        </p>
      )}
    </div>
  );
}
