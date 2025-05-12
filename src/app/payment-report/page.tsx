import Link from 'next/link';

export default function PaymentReportPage() {
  return (
    <div style={{ padding: '40px 20px' }}>
      <h2>振込完了報告フォーム</h2>
      <form action="#" method="post" style={{ maxWidth: '400px', margin: 'auto' }}>
        <div>
          <label>
            注文番号：
            <input type="text" name="orderId" required />
          </label>
        </div>
        <div>
          <label>
            登録メールアドレス：
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            振込名義人：
            <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            振込日：
            <input type="date" name="date" required />
          </label>
        </div>
        <div>
          <label>
            振込金額：
            <input type="number" name="amount" required /> 円
          </label>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button type="submit" className="add-cart-button">振込完了報告を送信</button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/" className="next-button">トップページに戻る</Link>
      </div>
    </div>
  );
}