// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('styles.css', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  it('leaves the root font size alone so rem-based tokens keep their pixel values', () => {
    const htmlRule = /:where\(html\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(htmlRule).not.toMatch(/font-size|font:/);
  });

  it('never pairs outline-none with a focus outline (Tailwind v4 would hide the ring)', () => {
    const src = new URL('../src/', import.meta.url);
    const files = readdirSync(src, { recursive: true, encoding: 'utf8' }).filter((f) =>
      /\.tsx?$/.test(f)
    );
    const offenders = files.flatMap((file) => {
      const text = readFileSync(new URL(file, src), 'utf8');
      const strings = text.match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g) ?? [];
      return strings
        .filter(
          (s) => /(^|\s|['"`])outline-none\b/.test(s) && /focus(-visible)?:outline-\d/.test(s)
        )
        .map((s) => `${file}: ${s}`);
    });
    expect(offenders).toEqual([]);
  });
});
