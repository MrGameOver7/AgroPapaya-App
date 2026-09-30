import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import test from 'node:test';

test('TypeScript compiler CLI reports its version', () => {
  const output = execFileSync(
    process.execPath,
    ['node_modules/typescript/bin/tsc', '--version'],
    { cwd: process.cwd(), encoding: 'utf8' },
  );

  assert.match(output, /^Version \d+\./);
});