import Link from "next/link";
import styles from "./Header.module.scss";
import SessionBadge from "./SessionBadge";
import MyPageButton from "@/components/MyPageButton";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <h1 className={styles.logo}>
          <Link href="/">おこめ販売</Link>
        </h1>
      </div>

      <form action="#" method="get" className={styles["header-search-form"]}>
        <input
          type="text"
          name="q"
          placeholder="商品 / 生産者名を探す"
          className={styles["header-search-input"]}
        />
        <button type="submit" className={styles["header-search-button"]}>
          検索
        </button>
      </form>

      <div className={styles["header-right"]}>
        <SessionBadge />
        {/* ログイン状態に応じて「マイページ」or「ログイン」に自動出し分け */}
        <MyPageButton className={styles["login-button"]} />
        <Link href="/cart" className={styles["cart-button"]}>
          カート
        </Link>
      </div>
    </header>
  );
}
