"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api } from "@/lib/api";
import {
  AddressesResponseSchema,
  AddressCreateInputSchema,
  AddressUpdateInputSchema,
  type Address,
} from "@/types/api";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { formatPostal7 } from "@/lib/format";
import { toUserMessage } from "@/lib/errorMessage";
import styles from "./AddressesPage.module.scss";

type CreateForm = z.infer<typeof AddressCreateInputSchema>;
type UpdateForm = z.infer<typeof AddressUpdateInputSchema>;

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<CreateForm>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateForm>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });

  function onChangeCreate<K extends keyof CreateForm>(k: K, v: string) {
    setCreateForm((s) => ({ ...s, [k]: v }));
  }
  function onChangeEdit<K extends keyof UpdateForm>(k: K, v: string) {
    setEditForm((s) => ({ ...s, [k]: v }));
  }

  async function load() {
    setBusy(true);
    setErr(null);
    try {
      const raw = await api<unknown>("/addresses", {
        method: "GET",
        cache: "no-store",
        parseErrorJson: true,
      });
      const data = AddressesResponseSchema.parse(raw);
      setItems(data);
    } catch (e: any) {
      setErr(toUserMessage(e, "住所一覧の取得に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = AddressCreateInputSchema.safeParse(createForm);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "入力エラー");
      return;
    }

    try {
      setBusy(true);
      await api("/addresses", { method: "POST", body: parsed.data, parseErrorJson: true });
      setCreateForm({
        recipient_name: "",
        postal_code: "",
        address_1: "",
        address_2: "",
        phone: "",
      });
      await load();
    } catch (e: any) {
      setErr(toUserMessage(e, "登録に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  function startEdit(a: Address) {
    setEditingId(a.id);
    setEditForm({
      recipient_name: a.recipient_name,
      postal_code: a.postal_code,
      address_1: a.address_1,
      address_2: a.address_2 ?? "",
      phone: a.phone,
    });
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    const parsed = AddressUpdateInputSchema.safeParse(editForm);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "入力エラー");
      return;
    }

    try {
      setBusy(true);
      await api(`/addresses/${editingId}`, {
        method: "PUT",
        body: parsed.data,
        parseErrorJson: true,
      });
      setEditingId(null);
      await load();
    } catch (e: any) {
      setErr(toUserMessage(e, "更新に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  async function onSetDefault(id: number) {
    setErr(null);
    try {
      setBusy(true);
      await api(`/addresses/${id}/default`, { method: "PUT", parseErrorJson: true });
      await load();
    } catch (e: any) {
      setErr(toUserMessage(e, "既定設定に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("この住所を削除します。よろしいですか？")) return;
    try {
      setBusy(true);
      await api(`/addresses/${id}`, { method: "DELETE", parseErrorJson: true });
      await load();
    } catch (e: any) {
      setErr(toUserMessage(e, "削除に失敗しました。"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <RequireLogin>
      <main className={styles.page}>
        <h1 className={styles.title}>配送先住所</h1>

        {err && <p className={styles.error}>{err}</p>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>新規追加</h2>
          <form className={styles.form} onSubmit={onCreate}>
            <label className={styles.field}>
              <span className={styles.label}>宛名</span>
              <input
                className={styles.input}
                value={createForm.recipient_name}
                onChange={(e) => onChangeCreate("recipient_name", e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>郵便番号（7桁）</span>
              <input
                className={styles.input}
                value={createForm.postal_code}
                onChange={(e) => onChangeCreate("postal_code", e.target.value)}
                inputMode="numeric"
                pattern="\d{7}"
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>住所1</span>
              <input
                className={styles.input}
                value={createForm.address_1}
                onChange={(e) => onChangeCreate("address_1", e.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>住所2（任意）</span>
              <input
                className={styles.input}
                value={createForm.address_2 ?? ""}
                onChange={(e) => onChangeCreate("address_2", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>電話番号</span>
              <input
                className={styles.input}
                value={createForm.phone}
                onChange={(e) => onChangeCreate("phone", e.target.value)}
              />
            </label>

            <button className={styles.button} type="submit" disabled={busy}>
              {busy ? "送信中…" : "追加する"}
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>登録済み</h2>

          {busy && <p className={styles.muted}>読み込み中…</p>}
          {!busy && items.length === 0 && <p className={styles.muted}>まだ住所はありません。</p>}

          <ul className={styles.items}>
            {items.map((a) => (
              <li key={a.id} className={styles.card}>
                {editingId === a.id ? (
                  <form className={styles.editForm} onSubmit={onUpdate}>
                    <div className={styles.lines}>
                      <label className={styles.field}>
                        <span className={styles.label}>宛名</span>
                        <input
                          className={styles.input}
                          value={editForm.recipient_name}
                          onChange={(e) => onChangeEdit("recipient_name", e.target.value)}
                          required
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>郵便番号</span>
                        <input
                          className={styles.input}
                          value={editForm.postal_code}
                          onChange={(e) => onChangeEdit("postal_code", e.target.value)}
                          inputMode="numeric"
                          pattern="\d{7}"
                          required
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>住所1</span>
                        <input
                          className={styles.input}
                          value={editForm.address_1}
                          onChange={(e) => onChangeEdit("address_1", e.target.value)}
                          required
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>住所2</span>
                        <input
                          className={styles.input}
                          value={editForm.address_2 ?? ""}
                          onChange={(e) => onChangeEdit("address_2", e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>電話番号</span>
                        <input
                          className={styles.input}
                          value={editForm.phone}
                          onChange={(e) => onChangeEdit("phone", e.target.value)}
                        />
                      </label>
                    </div>

                    <div className={styles.actions}>
                      <button className={styles.button} type="submit" disabled={busy}>
                        {busy ? "更新中…" : "保存する"}
                      </button>
                      <button
                        type="button"
                        className={styles.secondary}
                        onClick={() => setEditingId(null)}
                        disabled={busy}
                      >
                        キャンセル
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={styles.header}>
                      <strong>#{a.id}</strong>
                      <div className={styles.actionRow}>
                        {a.is_default ? (
                          <span className={styles.badgeDefault} aria-label="既定の住所">
                            既定
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={styles.primaryGhost}
                            onClick={() => onSetDefault(a.id)}
                            disabled={busy}
                          >
                            既定にする
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.secondary}
                          onClick={() => startEdit(a)}
                          disabled={busy}
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          className={styles.danger}
                          onClick={() => onDelete(a.id)}
                          disabled={busy}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <ul className={styles.lines}>
                      <li>{a.recipient_name}</li>
                      <li>{formatPostal7(a.postal_code)}</li>
                      <li>{a.address_1}</li>
                      {a.address_2 && <li>{a.address_2}</li>}
                      <li>{a.phone}</li>
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.helper}>
          <Link href="/mypage" className={styles.link}>
            マイページに戻る
          </Link>
        </p>
      </main>
    </RequireLogin>
  );
}
