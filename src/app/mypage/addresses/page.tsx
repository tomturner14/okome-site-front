"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  AddressesResponseSchema,
  AddressCreateInputSchema,
  type Address,
  type AddressCreateInput,
} from "@/types/api";
import styles from "./AddressesPage.module.scss";

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<AddressCreateInput>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });

  function onChange<K extends keyof AddressCreateInput>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function fetchList() {
    setErr(null);
    try {
      const raw = await api<unknown>("/addresses");
      const list = AddressesResponseSchema.parse(raw);
      setItems(list);
    } catch (e: any) {
      setErr(e?.message ?? "住所一覧の取得に失敗しました");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = AddressCreateInputSchema.safeParse(form);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "入力エラー");
      return;
    }

    try {
      setBusy(true);
      await api("/addresses", {
        method: "POST",
        body: parsed.data,
        parseErrorJson: true,
      });
      // 追加後に一覧再取得
      await fetchList();
      setForm({
        recipient_name: "",
        postal_code: "",
        address_1: "",
        address_2: "",
        phone: "",
      });
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("この住所を削除しますか？")) return;
    setErr(null);
    try {
      await api(`/addresses/${id}`, {
        method: "DELETE",
        parseErrorJson: true,
      });
      await fetchList();
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "削除に失敗しました");
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>配送先住所</h1>

      {err && <p className={styles.error}>{err}</p>}

      <section className={styles.section}>
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
            <span className={styles.label}>郵便番号（7桁）</span>
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
            <span className={styles.label}>住所1（都道府県・市区町村・番地）</span>
            <input
              className={styles.input}
              value={form.address_1}
              onChange={(e) => onChange("address_1", e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>住所2（建物名・部屋番号）</span>
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
              required
            />
          </label>

          <button className={styles.button} type="submit" disabled={busy}>
            {busy ? "送信中..." : "登録する"}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>登録済み</h2>

        {items.length === 0 ? (
          <p className={styles.muted}>登録済みの住所はありません。</p>
        ) : (
          <ul className={styles.items}>
            {items.map((a) => (
              <li key={a.id} className={styles.card}>
                <div className={styles.row}>
                  <span className={styles.name}>{a.recipient_name}</span>
                  <button
                    className={styles.danger}
                    onClick={() => onDelete(a.id)}
                    type="button"
                  >
                    削除
                  </button>
                </div>
                <div className={styles.addr}>
                  〒{a.postal_code} / {a.address_1}
                  {a.address_2 ? ` ${a.address_2}` : ""}
                </div>
                <div className={styles.phone}>{a.phone}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
