// 商品の型定義
export interface Product {
  id: number;
  name: string;           // 商品名（例: 千葉県産コシヒカリ）
  variety: string;        // 品種（例: コシヒカリ）
  origin: string;         // 産地（例: 千葉県）
  price: number;          // 価格（例: 4000）
  weight: string;         // 重量（例: 5kg）
  description: string;    // 商品説明
  imageUrl: string;       // 画像URL
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'; // 在庫状況
  farmerId?: number;      // 生産者ID（オプション）
}

// 生産者の型定義（将来的に使用）
export interface Farmer {
  id: number;
  name: string;           // 生産者名
  location: string;       // 所在地
  description: string;    // 説明
  imageUrl?: string;      // 画像URL（オプション）
}