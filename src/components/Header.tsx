import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo"><Link href="/">おこめ販売</Link></h1>
      </div>
    
      <form action="#" method="get" className="header-search-form">
        <input type="text" name="q" placeholder="商品 / 生産者名を探す" className="header-search-input" />
        <button type="submit" className="header-search-button">検索</button>
      </form>
    
      <div className="header-right">
        <Link href="/login" className="login-button">ログイン</Link>
        <Link href="/cart" className="cart-button">カート</Link>
      </div>
    </header>
  );
}