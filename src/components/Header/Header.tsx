import Link from "next/link";
import styles from "./Header.module.scss";
import MyPageButton from "@/components/MyPageButton";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brandBlock}>
          <p className={styles.brandLead}>千葉の農産物を、毎日の食卓へ</p>

          <h1 className={styles.logo}>
            <Link href="/">おこめ販売</Link>
          </h1>
        </div>

        <form
          action="/products"
          method="get"
          className={styles.headerSearchForm}
          role="search"
        >
          <label htmlFor="site-search" className={styles.visuallyHidden}>
            商品を検索
          </label>

          <input
            id="site-search"
            type="text"
            name="q"
            placeholder="商品名・品種名で探す"
            className={styles.headerSearchInput}
          />

          <button type="submit" className={styles.headerSearchButton}>
            検索
          </button>
        </form>

        <div className={styles.headerRight}>
          <MyPageButton className={styles.accountButton} />

          <Link href="/cart" className={styles.cartButton}>
            カート
          </Link>
        </div>
      </div>
    </header>
  );
}