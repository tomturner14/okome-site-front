"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Address,
  AddressCreateInput,
  AddressCreateInputSchema,
  AddressSchema,
  AddressesResponseSchema,
} from "@/types/api";
import styles from "./AddressPage.module.scss";

const EMPTY: AddressCreateInput = {
  recipient_name: "",
  postal_code: "",
  address_1: "",
  address_2: "",
  phone: "",
};

export default function AddressPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [form, setForm] = useState<AddressCreateInput>({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await api<unknown>("/addresses");
        const list = AddressesResponseSchema.parse(raw);
        setItems(list);
      } catch (e: any) {
        if (e?.status === 401) {
          location.href = `/login?next=${encodeURIComponent("/address")}`;
          return;
        }
        setErr("住所の取得に失敗しました");
      }
    })();
  }, []);

  function onChange<K extends keyof AddressCreateInput>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = AddressCreateInputSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力内容を確認してください";
      setErr(msg);
      return;
    }

    try {
      setBusy(true);
      const raw = await api<unknown>("/addresses", {
        method: "POST",
        body: parsed.data,
        parseErrorJson: true,
      });
      const created = AddressSchema.parse(raw);
      setItems((s) => [created, ...s]);
      setForm({ ...EMPTY });
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>配送先住所</h1>

      {/* ← className を外しました */}
      <section>
        <h2 className={styles.sectionTitle}>登録済み住所</h2>
        {items.length === 0 ? (
          <p className={styles.muted}>まだ登録がありません。</p>
        ) : (
          <ul className={styles.items}>
            {items.map((a) => (
              <li key={a.id} className={styles.item}>
                <p className={styles.name}>{a.recipient_name}</p>
                <p className={styles.addr}>
                  〒{a.postal_code}　{a.address_1}
                  {a.address_2 ? ` ${a.address_2}` : ""}
                </p>
                <p className={styles.phone}>{a.phone}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.formSec}>
        <h2 className={styles.sectionTitle}>新規登録</h2>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>宛名</span>
            <input
              className={styles.input}
              value={form.recipient_name}
              onChange={(e) => onChange("recipient_name", e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>郵便番号（7桁・ハイフンなし）</span>
            <input
              className={styles.input}
              value={form.postal_code}
              onChange={(e) => onChange("postal_code", e.target.value)}
              inputMode="numeric"
              pattern="\d{7}"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>住所</span>
            <input
              className={styles.input}
              value={form.address_1}
              onChange={(e) => onChange("address_1", e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>建物名・部屋番号（任意）</span>
            <input
              className={styles.input}
              value={form.address_2}
              onChange={(e) => onChange("address_2", e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>電話番号</span>
            <input
              className={styles.input}
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              inputMode="tel"
              required
            />
          </label>

          {err && <p className={styles.error}>{err}</p>}

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={busy}>
              {busy ? "登録中..." : "登録する"}
            </button>
            <Link href="/" className={styles.secondary}>
              トップへ戻る
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
