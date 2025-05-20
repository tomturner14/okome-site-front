import Link from 'next/link';

export default function DonePage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h2>ご注文ありがとうございました！</h2>
      <p>ご注文内容を確認のうえ、以下の口座へご入金ください。</p>

      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        marginTop: '20px',
        display: 'inline-block'
      }}>
        <p><strong>銀行名：</strong>〇〇銀行</p>
        <p><strong>支店名：</strong>△△支店</p>
        <p><strong>口座番号：</strong>1234567</p>
        <p><strong>名義：</strong>オコメハンバイ（カ）</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="next-button">トップに戻る</Link>
      </div>
    </div>
  );
}
