'use client';

import { useState } from 'react';
import CheckoutStartButton from '@/components/CheckoutStartButton';

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
    <div style={{ display: 'grid', gap: 8, maxWidth: 340 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        数量：
        <input
          type="number"
          min={1}
          step={1}
          value={qty}
          onChange={onChangeQty}
          style={{ width: 80, padding: 4 }}
        />
      </label>

      {/* ここが肝：variantId と quantity を lines に渡す */}
      <CheckoutStartButton
        lines={variantId ? [{ variantId, quantity: qty }] : []}
        className="btn-primary"
        label="今すぐ購入（Shopify）"
        disabled={disabled}
      />

      {/* variantId が取れない時はボタンを無効化してガイド表示 */}
      {!variantId && (
        <p style={{ color: '#b00', fontSize: 12, margin: 0 }}>
          この商品のバリアント ID を取得できませんでした。
        </p>
      )}
    </div>
  );
}
