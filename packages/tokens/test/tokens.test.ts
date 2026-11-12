import { describe, expect, it } from 'vitest';
import { colors, tokens, type ColorScheme } from '../src/tokens.ts';
import { toThemeCss } from '../src/css.ts';

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * linear((n >> 16) & 255) + 0.7152 * linear((n >> 8) & 255) + 0.0722 * linear(n & 255)
  );
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const INTENTS = ['primary', 'brand', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

describe.each<[string, ColorScheme]>(Object.entries(colors))('%s scheme contrast', (_, s) => {
  it.each([
    ['fg on bg', s.fg, s.bg],
    ['fg on surface', s.fg, s.surface],
    ['fg on surfaceMuted', s.fg, s.surfaceMuted],
    ['fg on surfaceHover', s.fg, s.surfaceHover],
    ['fgMuted on surfaceHover', s.fgMuted, s.surfaceHover],
    ['fgMuted on bg', s.fgMuted, s.bg],
    ['fgMuted on surface', s.fgMuted, s.surface],
    ['fgMuted on surfaceMuted', s.fgMuted, s.surfaceMuted],
    ...INTENTS.flatMap((i) => [
      [`on-${i} on ${i}`, s[i].onSolid, s[i].solid],
      [`on-${i} on ${i}-hover`, s[i].onSolid, s[i].solidHover],
      [`on-${i}-soft on ${i}-soft`, s[i].onSoft, s[i].soft],
    ]),
  ])('%s meets WCAG AA text contrast (4.5:1)', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ['input border on surface', s.borderInput, s.surface],
    ['focus ring on surface', s.focus, s.surface],
    ['focus ring on bg', s.focus, s.bg],
    ...s.chart.slice(0, 4).map((c, i) => [`chart-${i + 1} on surface`, c, s.surface]),
  ])('%s meets WCAG non-text contrast (3:1)', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(3);
  });
});

describe('theme.css', () => {
  const css = toThemeCss(tokens);

  it('replaces the Tailwind default palette with GGEM tokens', () => {
    expect(css).toContain('--color-*: initial;');
    expect(css).toContain(`--color-primary: ${colors.light.primary.solid};`);
    expect(css).toContain('--text-base: 0.875rem;');
  });

  it('defines every semantic colour for both schemes', () => {
    const names = (block = '') => [...block.matchAll(/(--color-[a-z-]+):/g)].map((m) => m[1]);
    const [, light, dark] = css.split(/@layer theme \{|\.dark \{/);
    expect(names(dark).sort()).toEqual(names(light).sort());
    expect(names(dark).length).toBeGreaterThan(40);
  });
});
