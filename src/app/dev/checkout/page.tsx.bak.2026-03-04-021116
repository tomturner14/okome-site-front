// 動作確認用：variantId と quantity を直で投げて Shopify に飛ぶ
import CheckoutStartButton from "@/components/CheckoutStartButton";

export default function DevCheckoutPage() {
  // ★手元の Shopify の ProductVariant GID に差し替えてテストしてください
  const VARIANT_ID = "gid://shopify/ProductVariant/xxxxxxxxxxxx";

  return (
    <main style={{ padding: 24 }}>
      <h1>Dev Checkout</h1>
      <p>ログイン済みの状態で、下のボタンを押すと Shopify チェックアウトへ遷移します。</p>

      <div style={{ marginTop: 16 }}>
        <CheckoutStartButton
          lines={[{ variantId: VARIANT_ID, quantity: 1 }]}
        // email や note、shippingAddress を事前セットする場合はここに追記
        />
      </div>
    </main>
  );
}
