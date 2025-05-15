'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddressPage.module.scss';

export default function AddressPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ここでは localStorage に保存する仮実装（Next.js App Router で Context にしてもよい）
    localStorage.setItem('deliveryInfo', JSON.stringify(formData));

    router.push('/confirm');
  };

  return (
    <div className={styles.form}>
      <h2>お届け先情報の入力</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>氏名:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
        </div>
        <div className={styles.field}>
          <label>住所:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </label>
        </div>
        <div className={styles.field}>
          <label>電話番号:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>
        </div>
        <div className={styles.field}>
          <label>メールアドレス:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>確認画面へ進む</button>
      </form>
    </div>
  );
}
