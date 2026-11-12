// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('styles.css', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  it('leaves the root font size alone so rem-based tokens keep their pixel values', () => {
    const htmlRule = /:where\(html\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(htmlRule).not.toMatch(/font-size|font:/);
  });
});
