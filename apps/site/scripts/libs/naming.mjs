/**
 * レクチャーのパス・配布物の命名規約を一元管理するモジュール。
 *
 *   sections/<sec>/<lec>/example  … 動くコード（配布 ZIP / プレビューの元）
 *   downloads/<sec>-<lec>.zip     … 配布 ZIP（build-downloads.mjs）
 *   preview/<sec>-<lec>/          … ライブプレビュー（build-previews.mjs）
 */

const LECTURE_REL_RE = /^sections\/([\w-]+)\/([\w-]+)$/;

/** `sections/<sec>/<lec>` を { sec, lec } に分解する。一致しなければ null。 */
export function parseLectureRel(lectureRel) {
  const m = lectureRel.match(LECTURE_REL_RE);
  return m ? { sec: m[1], lec: m[2] } : null;
}

/** レクチャーの動くコードのディレクトリ（`sections/<sec>/<lec>/example`）。 */
export function exampleDirOf(lectureRel) {
  return `${lectureRel}/example`;
}

/** プレビュー配置名（`<sec>-<lec>`）。public/preview/ 配下のフォルダ名。 */
export function previewNameOf(sec, lec) {
  return `${sec}-${lec}`;
}

/** 配布 ZIP のファイル名（`<sec>-<lec>.zip`）。 */
export function zipBasenameFor(sec, lec) {
  return `${sec}-${lec}.zip`;
}

/** サイト上の配布 ZIP への URL（`<base>/downloads/<sec>-<lec>.zip`）。 */
export function downloadUrlFor(base, sec, lec) {
  return `${base}/downloads/${zipBasenameFor(sec, lec)}`;
}

/** サイト上のライブプレビュー URL（`<base>/preview/<sec>-<lec>/index.html`）。 */
export function previewUrlFor(base, sec, lec) {
  return `${base}/preview/${previewNameOf(sec, lec)}/index.html`;
}
