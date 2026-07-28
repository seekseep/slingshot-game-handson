# slingshot-game-handson

Phaser 3 + Matter.js で「パチンコ物理ゲーム（アングリーバード風）」を段階的に作るハンズオン教材です。パチンコで鳥を飛ばし、構造物を崩して標的を倒すゲームを、白黒の物理・入力から作り始め、ゲームロジック、最後に画像・音の装飾へと組み上げます。

## 構成

- **教材サイト本体**: [`apps/site/`](./apps/site/) — Astro + Starlight 製。教材ソース（`apps/site/README.md`・`apps/site/sections/`）から静的サイトを生成します。教材の読み方・目次は [apps/site/README.md](./apps/site/README.md) を参照。
- **完成コード一覧**: [`assets/examples/`](./assets/examples/) — 各段階の完成コードだけを並べた素の一覧（教材の元ネタ）。

## 開発

```sh
cd apps/site
npm install
npm run dev
```

`npm run build` で `apps/site/dist/` に静的サイトを出力します。`main` への push で GitHub Actions（[.github/workflows/deploy-docs.yml](./.github/workflows/deploy-docs.yml)）が GitHub Pages にデプロイします。

## 公開先

https://seekseep.github.io/slingshot-game-handson/
