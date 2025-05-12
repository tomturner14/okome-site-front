import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h1>ログインページ</h1>
      <form>
        <div>
          <label>
            メールアドレス:
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            パスワード:
            <input type="password" name="password" required />
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="next-button">ログイン</button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>アカウントをお持ちでない方は<Link href="/register" style={{ color: '#319304' }}>こちら</Link>から登録できます。</p>
        <Link href="/" className="next-button">トップへ戻る</Link>
      </div>
    </div>
  );
}