import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 無視するファイルやディレクトリを指定
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
      '*.lock',
    ],
  },

  // ESLintのルールを指定
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;