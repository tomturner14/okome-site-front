import Link from 'next/link';

export default function FarmersPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h1>農家紹介ページ</h1>
      <p>
        ここでは、おこめ販売で取り扱っている農家さんをご紹介します。
        どの農家さんも安全で美味しいお米作りに情熱を注いでいます。
      </p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="next-button">トップへ戻る</Link>
      </div>
    </div>
  );
}