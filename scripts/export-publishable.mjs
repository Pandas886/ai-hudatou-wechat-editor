#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPublishableFilename, buildPublishableHtml } from '../publishable-export.mjs';

function parseArgs(argv) {
  const args = { input: '', output: '' };

  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (!args.input && !token.startsWith('-')) {
      args.input = token;
      continue;
    }
    if ((token === '-o' || token === '--output') && argv[i + 1]) {
      args.output = argv[i + 1];
      i++;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input) {
    console.error('Usage: bun scripts/export-publishable.mjs <input.md> [-o output.html]');
    process.exit(1);
  }

  const source = await readFile(args.input, 'utf8');
  const html = buildPublishableHtml(source);
  const outputPath = args.output || path.join(path.dirname(args.input), buildPublishableFilename(source));

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');

  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
