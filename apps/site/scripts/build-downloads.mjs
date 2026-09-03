#!/usr/bin/env node
/**
 * 各レクチャーの動くコード（`<lec>/example/`）を ZIP 化し、public/downloads/ に出力する。
 *
 * 対象: sections/<sec>/<lec>/example/index.html を持つレクチャー。
 * 出力: public/downloads/<sec>-<lec>.zip
 *       ZIP 内のルートフォルダは常に game/（どの節を解凍しても game/ になり、
 *       前の game/ に上書き展開すればそのまま育てていける）。
 *       example/assets/ を持つレクチャーは、素材だけの
 *       public/downloads/<sec>-<lec>-assets.zip も出す（ルートフォルダは assets/）。
 *       画像・音を扱う節で「素材だけ落として game/assets/ に置く」ためのもの。
 *
 * 中身は example/ 配下のファイルすべて（作業ツリー直読み。git 追跡は問わない）。
 * node_modules/ や .DS_Store のような雑多なものだけ除外する。
 */

import { createWriteStream } from 'node:fs';
import { glob, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

import archiver from 'archiver';

import { walkFiles } from './libs/fs-walk.mjs';
import {
  assetsZipBasenameFor,
  exampleDirOf,
  zipBasenameFor,
} from './libs/naming.mjs';
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

/** files（<absDir> 相対）を outPath に ZIP 化する。ZIP 内は rootDir/ 配下に置く。 */
function zipFiles(absDir, files, outPath, rootDir) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve(files.length));
    archive.on('warning', reject);
    archive.on('error', reject);
    archive.pipe(output);
    for (const rel of files) {
      archive.file(path.join(absDir, ...rel.split('/')), {
        name: path.posix.join(rootDir, rel),
      });
    }
    archive.finalize();
  });
}

async function zipLecture(lectureRel) {
  const [, sec, lec] = lectureRel.split('/');
  const exampleAbs = path.join(ROOT, ...exampleDirOf(lectureRel).split('/'));
  const files = await walkFiles(exampleAbs, {
    ignoreDirs: IGNORE_DIRS,
    ignoreNames: IGNORE_NAMES,
  });
  const outPath = path.join(DOWNLOADS_DIR, zipBasenameFor(sec, lec));
  return zipFiles(exampleAbs, files, outPath, 'game');
}

/**
 * example/assets/ があれば、その中身だけの ZIP を作る。無ければ null。
 * 学習者は game/ の隣に展開するだけで assets/ が揃う。
 */
async function zipLectureAssets(lectureRel) {
  const [, sec, lec] = lectureRel.split('/');
  const assetsAbs = path.join(
    ROOT,
    ...exampleDirOf(lectureRel).split('/'),
    'assets',
  );
  let files;
  try {
    files = await walkFiles(assetsAbs, {
      ignoreDirs: IGNORE_DIRS,
      ignoreNames: IGNORE_NAMES,
    });
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
  if (files.length === 0) return null;
  const outPath = path.join(DOWNLOADS_DIR, assetsZipBasenameFor(sec, lec));
  return zipFiles(assetsAbs, files, outPath, 'assets');
}

async function main() {
  await rm(DOWNLOADS_DIR, { recursive: true, force: true });
  await mkdir(DOWNLOADS_DIR, { recursive: true });

  const lectures = await findLectures();
  if (lectures.length === 0) {
    console.warn(
      '[build-downloads] no lectures found (sections/*/*/example/index.html)',
    );
  }

  for (const lectureRel of lectures) {
    const [, sec, lec] = lectureRel.split('/');
    const count = await zipLecture(lectureRel);
    console.log(
      `[build-downloads] ${lectureRel}/example -> public/downloads/${zipBasenameFor(sec, lec)} (${count} files)`,
    );
    const assetCount = await zipLectureAssets(lectureRel);
    if (assetCount !== null) {
      console.log(
        `[build-downloads] ${lectureRel}/example/assets -> public/downloads/${assetsZipBasenameFor(sec, lec)} (${assetCount} files)`,
      );
    }
  }

  console.log('[build-downloads] done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
