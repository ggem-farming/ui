import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '../dist');
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]
  );

// `npm run check` builds before testing; a bare `vitest` run without dist skips this.
describe.skipIf(!existsSync(dist))('published build', () => {
  it('keeps dependencies external instead of inlining copies of them', () => {
    expect(existsSync(join(dist, 'node_modules'))).toBe(false);
    const inlined = files(dist).filter(
      (file) => /\.(js|d\.ts)$/.test(file) && readFileSync(file, 'utf8').includes('node_modules/')
    );
    expect(inlined).toEqual([]);
  });
});
