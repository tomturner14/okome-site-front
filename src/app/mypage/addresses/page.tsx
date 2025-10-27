"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import {
  AddressesResponseSchema,
  Address,
  AddressCreateInputSchema,
  AddressUpdateInputSchema,
  type AddressCreateInput,
  type AddressUpdateInput,
} from "@/types/api";
import styles from "./AddressesPage.module.scss";

type CreateForm = AddressCreateInput;
type UpdateForm = AddressUpdateInput;

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 新規用
  const [createForm, setCreateForm] = useState<CreateForm>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });

  // 編集用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateForm>({
    recipient_name: "",
    postal_code: "",
    address_1: "",
    address_2: "",
    phone: "",
  });

  // 一覧取得
  async function load() {
    setErr(null);
    setBusy(true);
    try {
      const raw = await api<unknown>("/addresses", { cache: "no-store", parseErrorJson: true });
      const list = AddressesResponseSchema.parse(raw);
      setItems(list);
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "住所の取得に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // 作成
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const parsed = AddressCreateInputSchema.safeParse(createForm);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "入力エラー");
      return;
    }
    setBusy(true);
    try {
      const created = await api<Address>("/addresses", {
        method: "POST",
        body: parsed.data,
        parseErrorJson: true,
      });
      setItems((s) => [created, ...s]);
      setCreateForm({ recipient_name: "", postal_code: "", address_1: "", address_2: "", phone: "" });
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  // 編集開始
  function beginEdit(a: Address) {
    setEditingId(a.id);
    setEditForm({
      recipient_name: a.recipient_name,
      postal_code: a.postal_code,
      address_1: a.address_1,
      address_2: a.address_2 ?? "",
      phone: a.phone,
    });
  }

  // 更新
  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    const parsed = AddressUpdateInputSchema.safeParse(editForm);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "入力エラー");
      return;
    }

    setBusy(true);
    try {
      const updated = await api<Address>(`/addresses/${editingId}`, {
        method: "PUT",
        body: parsed.data,
        parseErrorJson: true,
      });
      setItems((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      setEditingId(null);
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "更新に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  // 削除
  async function onDelete(id: number) {
    if (!confirm("この住所を削除しますか？")) return;
    setBusy(true);
    try {
      await api(`/addresses/${id}`, { method: "DELETE", parseErrorJson: true });
      setItems((s) => s.filter((x) => x.id !== id));
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "削除に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/mypage/addresses")}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>配送先住所</h1>

        {err && <p className={styles.error}>{err}</p>}

        {/* 新規作成 */}
        <section>
          <h2 className={styles.sectionTitle}>新規追加</h2>
          <form className={styles.card} onSubmit={onCreate}>
            <label>
              宛名
              <input
                value={createForm.recipient_name}
                onChange={(e) => setCreateForm({ ...createForm, recipient_name: e.target.value })}
                required
              />
            </label>
            <label>
              郵便番号（数字7桁）
              <input
                value={createForm.postal_code}
                onChange={(e) => setCreateForm({ ...createForm, postal_code: e.target.value })}
                required
                pattern="\d{7}"
              />
            </label>
            <label>
              住所1
              <input
                value={createForm.address_1}
                onChange={(e) => setCreateForm({ ...createForm, address_1: e.target.value })}
                required
              />
            </label>
            <label>
              住所2（任意）
              <input
                value={createForm.address_2 ?? ""}
                onChange={(e) => setCreateForm({ ...createForm, address_2: e.target.value })}
              />
            </label>
            <label>
              電話番号
              <input
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                required
              />
            </label>

            <button className={styles.primary} type="submit" disabled={busy}>
              追加
            </button>
          </form>
        </section>

        {/* 一覧＋編集 */}
        <section>
          <h2 className={styles.sectionTitle}>登録済み住所</h2>

          {items.length === 0 ? (
            <p className={styles.muted}>登録済みの住所はありません。</p>
          ) : (
            <ul className={styles.list}>
              {items.map((a) => (
                <li key={a.id} className={styles.card}>
                  {editingId === a.id ? (
                    <form onSubmit={onUpdate} className={styles.editForm}>
                      <label>
                        宛名
                        <input
                          value={editForm.recipient_name}
                          onChange={(e) => setEditForm({ ...editForm, recipient_name: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        郵便番号
                        <input
                          value={editForm.postal_code}
                          onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                          required
                          pattern="\d{7}"
                        />
                      </label>
                      <label>
                        住所1
                        <input
                          value={editForm.address_1}
                          onChange={(e) => setEditForm({ ...editForm, address_1: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        住所2
                        <input
                          value={editForm.address_2 ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, address_2: e.target.value })}
                        />
                      </label>
                      <label>
                        電話番号
                        <input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          required
                        />
                      </label>

                      <div className={styles.actions}>
                        <button className={styles.primary} type="submit" disabled={busy}>更新</button>
                        <button type="button" onClick={() => setEditingId(null)}>キャンセル</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className={styles.rowMain}>
                        <p className={styles.name}>{a.recipient_name}</p>
                        <p className={styles.addr}>
                          〒{a.postal_code}　{a.address_1} {a.address_2}
                        </p>
                        <p className={styles.phone}>{a.phone}</p>
                      </div>
                      <div className={styles.actions}>
                        <button onClick={() => beginEdit(a)}>編集</button>
                        <button className={styles.danger} onClick={() => onDelete(a.id)}>削除</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className={styles.back}><Link href="/mypage">マイページに戻る</Link></p>
      </main>
    </RequireLogin>
  );
}
