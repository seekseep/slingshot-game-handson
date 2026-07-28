/**
 * LECTURE.md 中のセンチネルを、実ファイルから生成したブロックへ展開するモジュール。
 * sync-lectures.mjs から呼ばれる（`./project.zip` 差し替えと同じ「sync 時展開」方式）。
 *
 * 対応センチネル:
 *
 *   ::checkpoint            … 「このステップの完成例」を簡易エディタ UI で表示する。
 *                             左にファイル一覧、右にコード。加えて ZIP ダウンロードボタン。
 *                             対象は現在レクチャーの example/ 配下のコードファイル。
 *
 *   ::preview               … その場で遊べるライブプレビュー（iframe）を埋め込む。
 *   ::preview{src="<sec>/<lec>"}   別レクチャーの完成例を指定できる（省略時は現在レクチャー）。
 *   ::preview[キャプション]{...}    figcaption を付けられる。
 *
 * 生成物: エディタは `::::editor{...}` コンテナ（remark-editor.mjs が <section class="editor">
 * に変換）＋コードフェンス。プレビューは生 HTML の <figure><iframe></figure>。
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { walkFiles } from './fs-walk.mjs';
import { downloadUrlFor, previewUrlFor } from './naming.mjs';

const CHECKPOINT_RE = /^::checkpoint(?:\[([^\]]*)\])?(?:\{([^}]*)\})?\s*$/;
const PREVIEW_RE = /^::preview(?:\[([^\]]*)\])?(?:\{([^}]*)\})?\s*$/;

const IGNORE_DIRS = new Set(['node_modules', '.git']);
const IGNORE_NAMES = new Set(['.DS_Store']);

// エディタに全文表示する（＝学習者が書く）コードの拡張子。
const CODE_EXT = new Map([
  ['.html', 'html'],
  ['.js', 'js'],
  ['.css', 'css'],
  ['.json', 'json'],
]);

// ファイル一覧の並び順（この順に先頭へ寄せる。残りは名前順）。
const PRIORITY = ['index.html', 'main.js'];

function sortFiles(rels) {
  return rels.slice().sort((a, b) => {
    const ai = PRIORITY.indexOf(a);
    const bi = PRIORITY.indexOf(b);
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
    return a.localeCompare(b);
  });
}

/** `key="value"` 形式のディレクティブ属性文字列を { key: value } に。 */
function parseAttrs(s) {
  const attrs = {};
  if (!s) return attrs;
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(s))) attrs[m[1]] = m[2];
  return attrs;
}

/** 現在レクチャーの example/ から、簡易エディタ UI ブロック（Markdown）を作る。 */
async function buildEditorBlock({ exampleAbs, sec, lec, base, open }) {
  const all = await walkFiles(exampleAbs, { ignoreDirs: IGNORE_DIRS, ignoreNames: IGNORE_NAMES });
  const codeFiles = sortFiles(all.filter((rel) => CODE_EXT.has(path.extname(rel).toLowerCase())));

  const zipUrl = downloadUrlFor(base, sec, lec);
  const out = [];
  const openAttr = open ? ` open="${open}"` : '';
  out.push(`::::editor{zip="${zipUrl}"${openAttr}}`);
  for (const rel of codeFiles) {
    const lang = CODE_EXT.get(path.extname(rel).toLowerCase());
    const content = (await readFile(path.join(exampleAbs, ...rel.split('/')), 'utf8')).replace(/\n+$/, '');
    out.push('```' + lang + ' data-file="' + rel + '"');
    out.push(content);
    out.push('```');
  }
  out.push('::::');
  return out.join('\n');
}

/** ライブプレビュー（iframe）の生 HTML を作る。空行を含めない（HTML ブロックを壊さないため）。 */
function buildPreviewBlock({ base, sec, lec, caption }) {
  const src = previewUrlFor(base, sec, lec);
  const cap = caption ? `<figcaption class="lecture-preview__caption">${caption}</figcaption>` : '';
  return (
    `<figure class="lecture-preview">` +
    `<div class="lecture-preview__bar">` +
    `<button type="button" class="lecture-preview__reload" title="プレビューを再読み込み">↻ 再読み込み</button>` +
    `</div>` +
    `<iframe class="lecture-preview__frame" src="${src}" title="ライブプレビュー" loading="lazy"></iframe>` +
    cap +
    `</figure>`
  );
}

/**
 * 本文中の `::checkpoint` / `::preview` センチネルを展開する。
 * current = { sec, lec }（このレクチャー）。lecture 以外の docs では素通しする。
 */
export async function expandCheckpoints(body, { lectureAbsDir, sec, lec, base }) {
  if (!sec || !lec) return body;
  const exampleAbs = path.join(lectureAbsDir, 'example');

  const lines = body.split('\n');
  const out = [];
  for (const line of lines) {
    const cp = line.match(CHECKPOINT_RE);
    if (cp) {
      const cpAttrs = parseAttrs(cp[2]);
      out.push(await buildEditorBlock({ exampleAbs, sec, lec, base, open: cpAttrs.open }));
      continue;
    }
    const pv = line.match(PREVIEW_RE);
    if (pv) {
      const caption = pv[1] ? pv[1].trim() : '';
      const attrs = parseAttrs(pv[2]);
      let tSec = sec;
      let tLec = lec;
      if (attrs.src) {
        const parts = attrs.src.split('/');
        if (parts.length === 2) {
          tSec = parts[0];
          tLec = parts[1];
        }
      }
      out.push(buildPreviewBlock({ base, sec: tSec, lec: tLec, caption }));
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}
