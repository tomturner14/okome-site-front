"use client";

import { useState } from "react";
import CheckoutStartButton from "@/components/CheckoutStartButton";
import styles from "./BuyNowBox.module.scss";

type Props = {
  /** Shopify ProductVariant の GID（例: gid://shopify/ProductVariant/xxxxxxxx） */
  variantId: string | null;
  /** デフォルト数量（省略時 1） */
  defaultQty?: number;
};

export default function BuyNowBox({ variantId, defaultQty = 1 }: Props) {
  const [qty, setQty] = useState<number>(defaultQty);

  const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    setQty(Number.isFinite(n) && n > 0 ? Math.floor(n) : 1);
  };

  const disabled = !variantId;

  return (
    <section className={styles.buyNowBox} aria-label="購入手続き">
      <div className={styles.headingArea}>
        <p className={styles.heading}>ご注文内容</p>
        <p className={styles.note}>
          数量を選んで、購入手続きへお進みください。
        </p>
      </div>

      <label className={styles.quantityLabel}>
        <span className={styles.quantityText}>数量</span>
        <input
          className={styles.quantityInput}
          type="number"
          min={1}
          step={1}
          value={qty}
          onChange={onChangeQty}
        />
      </label>

      <CheckoutStartButton
        lines={variantId ? [{ variantId, quantity: qty }] : []}
        className={styles.checkoutButton}
        label="購入手続きへ進む"
        disabled={disabled}
      />

      {!variantId && (
        <p className={styles.error}>
          この商品は現在、購入手続きへ進めません。時間をおいて再度お試しください。
        </p>
      )}
    </section>
  );
}
