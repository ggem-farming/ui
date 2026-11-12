// Writes dist/theme.css (Tailwind v4 theme) and dist/tokens.json from src/tokens.ts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { tokens } from '../src/tokens.ts';
import { toThemeCss } from '../src/css.ts';

const out = new URL('../dist/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('theme.css', out), toThemeCss(tokens));
writeFileSync(new URL('tokens.json', out), `${JSON.stringify(tokens, null, 2)}\n`);
