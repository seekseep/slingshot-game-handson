/**
 * リポジトリ内の主要ディレクトリを一元管理するモジュール。
 * scripts 配下の各スクリプトはここを参照してパスを組み立てる。
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 教材ソース (README.md / sections/) と Astro アプリを兼ねるルート = apps/site
 * (apps/site/scripts/libs から 2 つ上)。ファイル走査・glob はこの ROOT 基準。
 */
export const ROOT = path.resolve(__dirname, '..', '..');
/** Astro アプリのディレクトリ。今は ROOT と同一 (apps/site)。 */
export const SITE_DIR = ROOT;

/**
 * リポジトリルートから ROOT (apps/site) までの POSIX 相対パス。
 * GitHub の blob/raw/edit URL は実ファイルのリポジトリ相対パスを指す必要があるため、
 * ROOT 相対パス (sections/... など) にこれを前置する。
 */
export const REPO_SUBDIR = 'apps/site';

export const DOCS_DIR = path.join(SITE_DIR, 'src', 'content', 'docs');
export const PUBLIC_DIR = path.join(SITE_DIR, 'public');
export const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');
