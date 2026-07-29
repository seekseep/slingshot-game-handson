---
docs: true
title: エディタを用意する
---

# 02 エディタを用意する

![エディタを用意する](./images/00-thumbnail.svg)

ゲームのコードを書くために、テキストエディタを用意します。おすすめは無料の
**Visual Studio Code（VS Code）** です。

## VS Code を入れる

まだ入っていなければ、公式サイトからダウンロードしてインストールします。

- Visual Studio Code: https://code.visualstudio.com/

## 作業フォルダを開く

このゲームは、1つの `game/` フォルダの中に作っていきます。VS Code で「フォルダを開く」から、
自分の作業フォルダを開いておきましょう。次の節で、その中に最初のファイルを作ります。

```text
game/
├── index.html   … ゲームを表示する入れ物（次の章で作る）
└── main.js      … ゲームのコード（次の章で作る）
```

## Live Server を入れておく（おすすめ）

このゲームは、あとの章で画像や音を読み込みます。画像や音は、ファイルを直接ダブルクリックして
開く方法（`file://`）だと、ブラウザの安全のしくみでうまく読み込めないことがあります。
そこで、**簡単な Web サーバー**を通して開くと安心です。

VS Code の拡張機能 **Live Server** を入れておくと、`index.html` を右クリック →
「Open with Live Server」でサーバー越しに開けます。次の節で、実際にブラウザで開いて確認します。

- Live Server（拡張機能）: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

VS Code の左側のバーにある拡張機能アイコン（四角が4つ並んだマーク）から `Live Server` と検索しても
インストールできます。
