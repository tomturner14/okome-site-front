import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h1>新規登録ページ</h1>
      <form>
        <div>
          <label>
            お名前:
            <input type="text" name="name" required />
          </label>
        </div>
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
        <div>
          <label>
            パスワード（確認）:
            <input type="password" name="passwordConfirm" required />
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="next-button">登録する</button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>すでにアカウントをお持ちの方は<Link href="/login" style={{ color: '#319304' }}>こちら</Link>からログインできます。</p>
        <Link href="/" className="next-button">トップへ戻る</Link>
      </div>
    </div>
  );
}