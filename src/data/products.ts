import { Product } from '../types/product';

// 商品データ
export const products: Product[] = [
  {
    id: 1,
    name: '千葉県産コシヒカリ',
    variety: 'コシヒカリ',
    origin: '千葉県',
    price: 4000,
    weight: '5kg',
    description: 'おいしい千葉のお米です。ふっくらツヤツヤ。',
    imageUrl: '/images/rice-placeholder.jpg', // 仮の画像
    stockStatus: 'in_stock'
  },
  {
    id: 2,
    name: '千葉県産ふさおとめ',
    variety: 'ふさおとめ',
    origin: '千葉県',
    price: 3800,
    weight: '5kg',
    description: '千葉県で生まれた品種で、あっさりとした味わいが特徴です。',
    imageUrl: '/images/rice-placeholder.jpg',
    stockStatus: 'in_stock'
  },
  {
    id: 3,
    name: '千葉県産ゆめぴりか',
    variety: 'ゆめぴりか',
    origin: '千葉県',
    price: 3900,
    weight: '5kg',
    description: '北海道生まれの品種を千葉の大地で育てました。もちもち食感です。',
    imageUrl: '/images/rice-placeholder.jpg',
    stockStatus: 'in_stock'
  }
];

// 商品IDで商品を取得する関数
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}