"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("ログアウト失敗");
      }
    } catch (err) {
      console.error("ログアウトエラー:", err);
    }
  };

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        return fetch("/api/me/orders");
      })
      .then((res) => res?.json())
      .then((data) => setOrders(data))
      .catch((err) => {
        console.error("注文履歴取得エラー:", err);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>注文履歴</h1>

      {/* ログアウトボタン */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        ログアウト
      </button>

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
