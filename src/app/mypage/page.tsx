"use client";

import { useEffect, useState } from "react";
import styles from "./MyPage.module.scss";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  order_number: number;
  total_price: number;
  ordered_at: string;
  items: OrderItem[];
};

export default function MyPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/me/orders")
      .then((res) => {
        if (!res.ok) throw new Error("注文履歴の取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("注文履歴取得エラー:", err);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>注文履歴</h1>
      {orders.length === 0 && <p>まだ注文がありません</p>}

      <ul>
        {orders.map((order) => (
          <li key={order.id} className={styles.order}>
            <p>注文番号: {order.order_number}</p>
            <p>合計金額: {order.total_price}円</p>
            <p>注文日時: {new Date(order.ordered_at).toLocaleString()}</p>
            <ul>
              {order.items.map((item, i) => (
                <li key={i} className={styles.item}>
                  {item.title} × {item.quantity}（{item.price}円）
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
