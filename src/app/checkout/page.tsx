"use client";

import { Suspense } from "react";

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

type CheckoutErrorKind = "auth" | "api";

type CheckoutError = {
  kind: CheckoutErrorKind;
  message: string;
};

function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "status" in error) {
    const status = Number((error as { status?: unknown }).status);
    return Number.isFinite(status) ? status : null;
  }
  return null;
}

export default function CheckoutPage(props: any) {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner {...props} />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const search = useSearchParams();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [error, setError] = useState<CheckoutError | null>(null);

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
      } catch (e) {
        if (canceled) return;

        const status = getErrorStatus(e);

        if (status === 401) {
          setError({
            kind: "auth",
            message: "購入手続きにはログインが必要です。",
          });
          return;
        }

        setError({
          kind: "api",
          message: "住所情報の取得に失敗しました。時間をおいて再度お試しください。",
        });
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

  const queryString = search.toString();
  const nextPath = `/checkout${queryString ? `?${queryString}` : ""}`;

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

  if (loading) {
    return <p className={styles.page}>読み込み中…</p>;
  }
  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.h1}>チェックアウト</h1>
        <p className={styles.error}>{error.message}</p>

        {error.kind === "auth" ? (
          <p>
            <Link className={styles.link} href={`/login?next=${encodeURIComponent(nextPath)}`}>
              ログインする
            </Link>
            {" "}
            <Link className={styles.link} href={`/register?next=${encodeURIComponent(nextPath)}`}>
              新規登録する
            </Link>
          </p>
        ) : (
          <p>
            ページを再読み込みしても解消しない場合は、時間をおいて再度お試しください。
          </p>
        )}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.h1}>チェックアウト</h1>
        <p>購入手続きには配送先住所の登録が必要です。</p>
        <p>
          <Link className={styles.link} href="/mypage/addresses">
            配送先住所を登録する
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
        {/* Shopify チェックアウトへ直行 */}
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
