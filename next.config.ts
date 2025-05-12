// next.config.ts の場合
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // Dockerイメージサイズを最適化
  async rewrites() {
    // 環境変数が設定されていない場合はデフォルト値を使用
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*` // バックエンドへのプロキシ
      }
    ]
  }
}

export default nextConfig