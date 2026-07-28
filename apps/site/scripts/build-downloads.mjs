#!/usr/bin/env node
/**
 * 各レクチャーの動くコード（`<lec>/example/`）を ZIP 化し、public/downloads/ に出力する。
 *
 * 対象: sections/<sec>/<lec>/example/index.html を持つレクチャー。
 * 出力: public/downloads/<sec>-<lec>.zip
 *       ZIP 内のルートフォルダは常に game/（どの節を解凍しても game/ になり、
 *       前の game/ に上書き展開すればそのまま育てていける）。
 *
 * 中身は example/ 配下のファイルすべて（作業ツリー直読み。git 追跡は問わない）。
 * node_modules/ や .DS_Store のような雑多なものだけ除外する。
 */

import { createWriteStream } from 'node:fs';
import { glob, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import archiver from 'archiver';

import { walkFiles } from './libs/fs-walk.mjs';
import { exampleDirOf, zipBasenameFor } from './libs/naming.mjs';
import { DOWNLOADS_DIR, ROOT } from './libs/paths.mjs';

const IGNORE_DIRS = new Set(['node_modules', '.git']);
const IGNORE_NAMES = new Set(['.DS_Store']);

async function findLectures() {
  const dirs = [];
  const it = glob('sections/*/*/example/index.html', { cwd: ROOT });
  for await (const rel of it) {
    const posix = rel.split(path.sep).join('/');
    dirs.push(path.posix.dirname(path.posix.dirname(posix)));
  }
  return dirs.sort();
}

async function zipLecture(lectureRel) {
  const [, sec, lec] = lectureRel.split('/');
  const exampleAbs = path.join(ROOT, ...exampleDirOf(lectureRel).split('/'));
  const files = await walkFiles(exampleAbs, { ignoreDirs: IGNORE_DIRS, ignoreNames: IGNORE_NAMES });
  const outPath = path.join(DOWNLOADS_DIR, zipBasenameFor(sec, lec));

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve(files.length));
    archive.on('warning', reject);
    archive.on('error', reject);
    archive.pipe(output);
    for (const rel of files) {
      archive.file(path.join(exampleAbs, ...rel.split('/')), { name: path.posix.join('game', rel) });
    }
    archive.finalize();
  });
}

async function main() {
  await rm(DOWNLOADS_DIR, { recursive: true, force: true });
  await mkdir(DOWNLOADS_DIR, { recursive: true });

  const lectures = await findLectures();
  if (lectures.length === 0) {
    console.warn('[build-downloads] no lectures found (sections/*/*/example/index.html)');
  }

  for (const lectureRel of lectures) {
    const [, sec, lec] = lectureRel.split('/');
    const count = await zipLecture(lectureRel);
    console.log(`[build-downloads] ${lectureRel}/example -> public/downloads/${zipBasenameFor(sec, lec)} (${count} files)`);
  }

  console.log('[build-downloads] done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
