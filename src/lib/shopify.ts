import Client from 'shopify-buy';

// Shopify クライアントの初期化
const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: '2024-04',
});

// 商品一覧を取得する関数
export async function getProducts() {
  try {
    const rawProducts = await client.product.fetchAll();

    const products = rawProducts.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.images?.[0]?.src ?? '',
      price: product.variants?.[0]?.price?.amount ?? 0,
    }));

    return products;
  } catch (error) {
    console.error('Shopify から商品データの取得に失敗しました:', error);
    return [];
  }
}

// 商品詳細を取得する関数
export async function getProduct(handle: string) {
  try {
    const product = await client.product.fetchByHandle(handle);
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(`Shopify から商品 ${handle} の取得に失敗しました:`, error);
    return null;
  }
}

// カートを作成する関数
export async function createCart() {
  try {
    const cart = await client.checkout.create();
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('カートの作成に失敗しました:', error);
    return null;
  }
}

// カートに商品を追加する関数
export async function addToCart(checkoutId: string, variantId: string, quantity: number = 1) {
  try {
    const cart = await client.checkout.addLineItems(checkoutId, [
      { variantId, quantity }
    ]);
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('カートへの商品追加に失敗しました:', error);
    return null;
  }
}

// カートを取得する関数
export async function getCart(checkoutId: string) {
  try {
    const cart = await client.checkout.fetch(checkoutId);
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('カートの取得に失敗しました:', error);
    return null;
  }
}

// カートから商品を削除する関数
export async function removeFromCart(checkoutId: string, lineItemIds: string[]) {
  try {
    const cart = await client.checkout.removeLineItems(checkoutId, lineItemIds);
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('カートからの商品削除に失敗しました:', error);
    return null;
  }
}

// カート内の商品数量を更新する関数
export async function updateCartItem(checkoutId: string, lineItemId: string, quantity: number) {
  try {
    const cart = await client.checkout.updateLineItems(checkoutId, [
      { id: lineItemId, quantity }
    ]);
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('カート内商品の更新に失敗しました:', error);
    return null;
  }
}

export default client;
