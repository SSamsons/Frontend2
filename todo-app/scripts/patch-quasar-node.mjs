import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const checkFile = join(
  'node_modules',
  '@quasar',
  'app-vite',
  'lib',
  'node-version-check.js',
);

if (existsSync(checkFile)) {
  writeFileSync(checkFile, '// patched: allow local Node versions\n');
}
