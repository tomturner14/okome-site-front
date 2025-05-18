# 1. Node公式の軽量イメージをベースに使用
FROM node:18-alpine

# 2. 作業ディレクトリを作成
WORKDIR /app

# 3. 依存ファイルをコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. ソースコードをすべてコピー
COPY . .

# 6. Next.js をビルド
RUN npm run build

# 7. 本番用に起動
EXPOSE 3000
CMD ["npm", "start"]
