import { copyFile } from 'node:fs/promises';
// This extension uses native ES modules and Vue render functions; no bundling required.
await copyFile(new URL('./src/index.js', import.meta.url), new URL('./dist/index.js', import.meta.url));
