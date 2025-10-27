"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { api } from "@/lib/api";
import {
  MeResponseSchema,
  AddressesResponseSchema,
  AddressSchema,
  AddressCreateInputSchema,
  type Address,
  type AddressCreateInput,
} from "@/types/api";
import styles from "./AddressesPage.module.scss";

export default function AddressesPage() {
  const router = useRouter();

  const [addrList, setAddrList] = useState<Address[]>([]);
  const [form, setForm] = useState<AddressCreateInput>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ログインチェック＆初期ロード
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const meRaw = await api<unknown>("/me", { parseErrorJson: true });
        const me = MeResponseSchema.parse(meRaw);
        if (!me.loggedIn || !me.user) {
          router.replace(`/login?next=/mypage/addresses`);
          return;
        }
        if (!active) return;

        const raw = await api<unknown>("/addresses", { parseErrorJson: true });
        const list = AddressesResponseSchema.parse(raw);
        if (!active) return;
        setAddrList(list);
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "読み込みに失敗しました");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  function onChange<K extends keyof AddressCreateInput>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = AddressCreateInputSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力エラー";
      setErr(msg);
      return;
    }

    try {
      setSubmitting(true);
      const createdRaw = await api<unknown>("/addresses", {
        method: "POST",
        body: parsed.data,
        parseErrorJson: true,
      });
      const created = AddressSchema.parse(createdRaw);
      setAddrList((prev) => [created, ...prev]);
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
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("この住所を削除しますか？")) return;
    setErr(null);
    try {
      await api<{ ok: true }>(`/addresses/${id}`, {
        method: "DELETE",
        parseErrorJson: true,
      });
      setAddrList((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "削除に失敗しました");
    }
  }

  if (busy) return <main className={styles.page}>読み込み中...</main>;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>住所帳</h1>
      <p className={styles.breadcrumb}>
        <Link href="/mypage">マイページ</Link> / 住所帳
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>新規追加</h2>
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
              inputMode="numeric"
              maxLength={7}
              value={form.postal_code}
              onChange={(e) =>
                onChange("postal_code", e.target.value.replace(/\D/g, "").slice(0, 7))
              }
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
            <span className={styles.label}>建物名・部屋番号</span>
            <input
              className={styles.input}
              value={form.address_2}
              onChange={(e) => onChange("address_2", e.target.value)}
              placeholder="任意"
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

          {err && <p className={styles.error}>{err}</p>}

          <button className={styles.button} type="submit" disabled={submitting}>
            {submitting ? "送信中..." : "追加する"}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>登録済み住所</h2>
        {addrList.length === 0 ? (
          <p className={styles.muted}>住所はまだ登録されていません。</p>
        ) : (
          <ul className={styles.list}>
            {addrList.map((a) => (
              <li key={a.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <span className={styles.name}>{a.recipient_name}</span>
                  <button className={styles.delete} onClick={() => onDelete(a.id)}>
                    削除
                  </button>
                </div>
                <div className={styles.body}>
                  <div>〒{a.postal_code}</div>
                  <div>{a.address_1}{a.address_2 ? ` ${a.address_2}` : ""}</div>
                  <div>{a.phone}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
