import Link from 'next/link';

export default function AddressPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2>お届け先情報の入力</h2>
      <form action="/confirm" method="POST">
        <div>
          <label>
            氏名: 
            <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            住所: 
            <input type="text" name="address" required />
          </label>
        </div>
        <div>
          <label>
            電話番号: 
            <input type="tel" name="phone" required />
          </label>
        </div>
        <div>
          <label>
            メールアドレス: 
            <input type="email" name="email" required />
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="next-button">お届け先の登録</button>
        </div>
      </form>
      <div className="cart-actions">
        <Link href="/confirm" className="next-button">確認画面へ進む</Link>
      </div>
    </div>
  );
}