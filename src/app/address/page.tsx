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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 初回取得
  useEffect(() => {
    (async () => {
      try {
        const raw = await api<unknown>("/addresses", { cache: "no-store" });
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

  function clearForm() {
    setForm({ ...EMPTY });
    setEditingId(null);
  }

  // 新規作成
  async function onCreate(e: React.FormEvent) {
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
      // 先頭に追加（既定はサーバ側の is_default を反映）
      setItems((s) => [created, ...s]);
      clearForm();
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  // 編集開始
  function startEdit(a: Address) {
    setForm({
      recipient_name: a.recipient_name,
      postal_code: a.postal_code,
      address_1: a.address_1,
      address_2: a.address_2 ?? "",
      phone: a.phone,
    });
    setEditingId(a.id);
    setErr(null);
  }

  // 更新保存
  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setErr(null);
    const parsed = AddressCreateInputSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力内容を確認してください";
      setErr(msg);
      return;
    }

    try {
      setBusy(true);
      const raw = await api<unknown>(`/addresses/${editingId}`, {
        method: "PUT",
        body: parsed.data,
        parseErrorJson: true,
      });
      const updated = AddressSchema.parse(raw);
      setItems((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      clearForm();
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "更新に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  // 既定化
  async function setDefault(id: number) {
    try {
      setBusy(true);
      const raw = await api<unknown>(`/addresses/${id}/default`, {
        method: "PUT",
        parseErrorJson: true,
      });
      const updated = AddressSchema.parse(raw);
      setItems((s) =>
        s.map((x) =>
          x.id === updated.id ? { ...updated, is_default: true } : { ...x, is_default: false }
        )
      );
    } catch (e: any) {
      alert(e?.data?.error ?? e?.message ?? "既定の設定に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  // 削除
  async function remove(id: number) {
    if (!confirm("この住所を削除します。よろしいですか？")) return;
    try {
      setBusy(true);
      await api(`/addresses/${id}`, { method: "DELETE", parseErrorJson: true });
      setItems((s) => s.filter((x) => x.id !== id));
      // 編集中に削除されたらフォームをクリア
      if (editingId === id) clearForm();
    } catch (e: any) {
      alert(e?.data?.error ?? e?.message ?? "削除に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  const isEditMode = editingId != null;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>配送先住所</h1>

      {/* 登録済み一覧 */}
      <section>
        <h2 className={styles.sectionTitle}>登録済み住所</h2>
        {items.length === 0 ? (
          <p className={styles.muted}>まだ登録がありません。</p>
        ) : (
          <ul className={styles.items}>
            {items.map((a) => (
              <li key={a.id} className={styles.item}>
                <p className={styles.name}>
                  {a.recipient_name}{" "}
                  {a.is_default ? <span className={styles.badgeDefault}>既定</span> : null}
                </p>
                <p className={styles.addr}>
                  〒{a.postal_code}　{a.address_1}
                  {a.address_2 ? ` ${a.address_2}` : ""}
                </p>
                <p className={styles.phone}>{a.phone}</p>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => startEdit(a)}
                    disabled={busy}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => setDefault(a.id)}
                    disabled={busy || a.is_default}
                    title={a.is_default ? "既に既定です" : "既定の配送先にする"}
                  >
                    既定にする
                  </button>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => remove(a.id)}
                    disabled={busy}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 新規 or 編集フォーム */}
      <section className={styles.formSec}>
        <h2 className={styles.sectionTitle}>{isEditMode ? "住所を編集" : "新規登録"}</h2>

        <form className={styles.form} onSubmit={isEditMode ? onUpdate : onCreate}>
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
              {busy ? (isEditMode ? "更新中..." : "登録中...") : isEditMode ? "更新する" : "登録する"}
            </button>
            {isEditMode ? (
              <button
                type="button"
                className={styles.secondary}
                onClick={clearForm}
                disabled={busy}
              >
                編集をやめる
              </button>
            ) : (
              <Link href="/" className={styles.secondary}>
                トップへ戻る
              </Link>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
